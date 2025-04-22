import * as z from "zod";

export const personalInfoSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Phone number must be at least 10 digits"),
	dateOfBirth: z.string(),
});

export const vehicleInfoSchema = z.object({
	make: z.string().min(2, "Make must be at least 2 characters"),
	model: z.string().min(2, "Model must be at least 2 characters"),
	year: z.string().min(4, "Please enter a valid year"),
	vin: z.string().min(17, "VIN must be 17 characters").max(17),
});

export const coverageInfoSchema = z.object({
	coverageType: z.enum(["basic", "standard", "premium"]),
	deductible: z.enum(["500", "1000", "2000"]),
	additionalCoverage: z.array(z.string()),
});

// Add exports for the type definitions that are needed by MultiStepForm.jsx
export const PersonalInfo = personalInfoSchema;
export const VehicleInfo = vehicleInfoSchema;
export const CoverageInfo = coverageInfoSchema;
