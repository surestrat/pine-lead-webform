import { logger } from "@utils/logger";
import { quoteFormSchema } from "@schemas/quoteFormSchema";
import axios from "axios";

// Create an axios instance (customize baseURL as needed)
export const apiClient = axios.create({
	baseURL: "https://your-api-base-url.com", // <-- Replace with your API base URL
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Example function to send the SureStrat payload
export async function sendSureStratQuote(payload) {
	try {
		const response = await apiClient.post("/your-endpoint", payload); // <-- Replace with your endpoint
		return response.data;
	} catch (error) {
		// Optionally handle/log error
		throw error.response?.data || error;
	}
}

const db = "";

// Sanitize numeric fields
const sanitizeNumericFields = (data) => {
	// Create a copy to avoid mutating the original
	const sanitized = { ...data };

	// Fields that need to be sanitized
	const numericFields = [
		"propertyValue",
		"age",
		"employeeCount",
		"vehicleYear",
		"monthlyIncome",
	];

	// Sanitize each field
	for (const field of numericFields) {
		if (field in sanitized) {
			const value = sanitized[field];
			if (value === "" || value === undefined) {
				sanitized[field] = null;
			} else {
				const num = Number(value);
				sanitized[field] = isNaN(num) ? null : num;
			}
		}
	}

	return sanitized;
};

/**
 * Handle quote form submission
 * @param {Object} data Form data to submit
 * @param {Function} setIsSubmitting State setter for submission status
 * @param {Function} setSubmitError State setter for error state
 * @param {Function} setSubmitSuccess State setter for success state
 * @param {Function} reset Form reset function from react-hook-form
 */
export const handleQuoteSubmission = async (
	data,
	setIsSubmitting,
	setSubmitError,
	setSubmitSuccess,
	reset
) => {
	// Sanitize the data before submission
	const sanitizedData = sanitizeNumericFields(data);

	logger.info("🏁 Quote submission started");
	logger.debug("📝 Form data:", data);

	try {
		// First, validate the form data with zod
		const validationResult = quoteFormSchema.safeParse(sanitizedData);

		if (!validationResult.success) {
			const formattedErrors = validationResult.error.format();
			logger.error("❌ Form validation errors:", formattedErrors);

			// Format error messages for display
			const errorMessages = validationResult.error.errors.map((err) => {
				// Format the path for better readability
				const fieldName = err.path.join(".").replace(/\.(\d+)/g, "[$1]");
				return `${fieldName}: ${err.message}`;
			});

			throw new Error(errorMessages[0] || "Form validation failed");
		}

		// Start submission process
		setIsSubmitting(true);
		setSubmitError(null);

		// Use validated data
		const validatedData = validationResult.data;

		// Check for network connection before attempting submission
		if (!navigator.onLine) {
			throw new Error(
				"You appear to be offline. Please check your internet connection and try again."
			);
		}

		// For development mode, we'll simulate a successful API response
		const isLocalhost =
			window.location.hostname === "localhost" ||
			window.location.hostname === "127.0.0.1";

		if (isLocalhost) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Log for debugging
			logger.debug("🔄 Using development mode API simulation");

			// Create a mock successful response
			const mockResponse = {
				success: true,
				message: "Quote submitted successfully (Development Mode)",
				quoteId: Math.floor(10000 + Math.random() * 90000),
				reference: `QT${new Date()
					.toISOString()
					.slice(0, 10)
					.replace(/-/g, "")}${Math.floor(1000 + Math.random() * 9000)}`,
				timestamp: new Date().toISOString(),
			};

			logger.debug("📤 Development mode response:", mockResponse);

			// Handle success
			logger.info("✅ Quote submitted successfully!");
			logger.debug("🆔 Quote ID:", mockResponse.quoteId);
			logger.debug("📝 Reference:", mockResponse.reference);

			// Update UI state
			setSubmitSuccess(true);
			reset(); // Reset form fields

			// Reset success state after delay
			setTimeout(() => {
				setSubmitSuccess(false);
			}, 5000);

			return mockResponse;
		}

		// Generate unique reference number
		const referenceNumber = `QT${new Date()
			.toISOString()
			.slice(0, 10)
			.replace(/-/g, "")}${Math.floor(1000 + Math.random() * 9000)}`;
		const timestamp = new Date().toISOString();

		// Create quote document in Appwrite
		const quoteData = {
			reference_number: referenceNumber,
			status: "pending",
			created_at: timestamp,
			updated_at: timestamp,
		};

		// 1. Create the main quote document
		const quote = await db.quotes.create(quoteData);

		const quoteId = quote.$id;
		logger.debug("Quote created with ID:", quoteId);

		// 2. Add personal details
		const personalData = {
			quote_id: quoteId,
			first_name: validatedData.firstName,
			last_name: validatedData.lastName,
			id_number: validatedData.idNumber,
			phone: validatedData.phone,
			email: validatedData.email,
			province: validatedData.province,
			marital_status: validatedData.maritalStatus || null,
			employment_status: validatedData.employmentStatus || null,
			occupation: validatedData.occupation || null,
			monthly_income: validatedData.monthlyIncome || null,
		};

		await db.personalDetails.create(personalData);
		logger.debug("Personal details added");

		// 3. Add insurance types and related details
		for (const insuranceType of validatedData.insuranceTypes) {
			// Add the insurance type
			await db.insuranceTypes.create({
				quote_id: quoteId,
				insurance_type: insuranceType,
			});

			// Add specific insurance details based on type
			switch (insuranceType) {
				case "vehicle":
					if (validatedData.vehicleType) {
						await db.vehicleDetails.create({
							quote_id: quoteId,
							vehicle_count: validatedData.vehicleCount || null,
							vehicle_type: validatedData.vehicleType || null,
							vehicle_year: validatedData.vehicleYear || null,
							vehicle_make: validatedData.vehicleMake || null,
							vehicle_model: validatedData.vehicleModel || null,
							vehicle_usage: validatedData.vehicleUsage || null,
						});
						logger.debug("Vehicle details added");
					}
					break;

				case "home":
					await db.propertyDetails.create({
						quote_id: quoteId,
						property_type: validatedData.propertyType || null,
						property_value: validatedData.propertyValue || null,
						property_address: validatedData.propertyAddress || null,
						security_measures: validatedData.securityMeasures || null,
					});
					logger.debug("Property details added");
					break;

				case "life":
					await db.lifeInsuranceDetails.create({
						quote_id: quoteId,
						age: validatedData.age || null,
						smoking_status: validatedData.smokingStatus || null,
						coverage_amount: validatedData.coverageAmount || null,
						existing_conditions: validatedData.existingConditions || null,
					});
					logger.debug("Life insurance details added");
					break;

				case "business":
					await db.businessDetails.create({
						quote_id: quoteId,
						business_name: validatedData.businessName || null,
						business_type: validatedData.businessType || null,
						coverage_types: validatedData.coverageTypes || null,
						employee_count: validatedData.employeeCount || null,
					});
					logger.debug("Business details added");
					break;
			}
		}

		// 4. Store terms agreement
		await db.termsAgreement.create({
			quote_id: quoteId,
			terms_accepted: true,
			accepted_at: new Date().toISOString(),
		});
		logger.debug("Terms agreement recorded");

		// Prepare response object
		const response = {
			success: true,
			message: "Quote submitted successfully",
			quoteId: quoteId,
			reference: referenceNumber,
			timestamp: timestamp,
		};

		// Handle success
		logger.info("✅ Quote submitted successfully!");
		logger.debug("🆔 Quote ID:", response.quoteId);
		logger.debug("📝 Reference:", response.reference);

		// Update UI state
		setSubmitSuccess(true);
		reset(); // Reset form fields

		// Reset success state after delay
		setTimeout(() => {
			setSubmitSuccess(false);
		}, 5000);

		return response;
	} catch (error) {
		logger.error("💔 Quote submission failed:", error);
		setSubmitError(error.message || "An unexpected error occurred");

		// Clear error after delay
		setTimeout(() => {
			setSubmitError(null);
		}, 5000);

		throw error;
	} finally {
		setIsSubmitting(false);
		logger.debug("🏷️ Quote submission process completed");
	}
};

export default { handleQuoteSubmission };
