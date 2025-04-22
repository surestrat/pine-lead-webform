import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@utils/logger";
import { ErrorHandler } from "@utils/errorHandler";

export const useFormWithValidation = (
	schema,
	defaultValues = {},
	mode = "onBlur"
) => {
	const formMethods = useForm({
		defaultValues,
		resolver: zodResolver(schema),
		mode,
	});

	const { handleSubmit, formState, setError } = formMethods;

	// Enhanced submit handler with safety checks for numeric fields and additional validation
	const handleSubmitSafe = (onValid, onInvalid) => {
		return handleSubmit((data) => {
			// Check if we're online before allowing submission
			if (!navigator.onLine) {
				setError("root.serverError", {
					type: "manual",
					message:
						"You are offline. Please check your internet connection and try again.",
				});

				if (typeof onInvalid === "function") {
					onInvalid({ offline: true });
				}
				return;
			}

			try {
				// Sanitize common numeric fields that may cause issues
				const numericFields = [
					"propertyValue",
					"age",
					"employeeCount",
					"vehicleYear",
					"monthlyIncome",
				];

				// Create a sanitized copy
				const sanitizedData = { ...data };

				// Process each field
				numericFields.forEach((field) => {
					if (field in data) {
						const value = data[field];
						if (value === "" || value === undefined || value === null) {
							sanitizedData[field] = null;
						} else if (typeof value === "string") {
							const parsed = Number(value);
							sanitizedData[field] = isNaN(parsed) ? null : parsed;
						}
					}
				});

				// Perform additional security validation for critical fields
				const criticalFields = {
					email: "email",
					phone: "phone",
					idNumber: "idNumber",
					firstName: "name",
					lastName: "name",
				};

				// Validate critical fields
				for (const [field, validationType] of Object.entries(criticalFields)) {
					if (field in sanitizedData && sanitizedData[field]) {
						// Only set a security error if there is NOT already a Zod error for this field
						if (
							!ErrorHandler.validateSecurityInput(
								sanitizedData[field],
								validationType
							)
						) {
							// Check if Zod already set an error for this field
							if (!formMethods.formState.errors[field]) {
								logger.warn(`Security validation failed for field: ${field}`);
								setError(field, {
									type: "security",
									message: `Invalid ${field} format`,
								});

								if (typeof onInvalid === "function") {
									onInvalid(formMethods.formState.errors);
								}
								return;
							}
						}
					}
				}

				logger.debug("🧹 Sanitized form data:", sanitizedData);

				// Call the original handler with sanitized data
				return onValid(sanitizedData);
			} catch (error) {
				// Log the error
				ErrorHandler.logErrorToMonitoring(error, "form-submission");

				// Set a general form error
				setError("root.serverError", {
					type: "manual",
					message:
						error.message ||
						"An unexpected error occurred during form submission.",
				});

				if (typeof onInvalid === "function") {
					onInvalid(error);
				}
			}
		}, onInvalid);
	};

	return {
		...formMethods,
		handleSubmitSafe,
		errors: formState.errors,
	};
};
