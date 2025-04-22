import { z } from "zod";

// Policyholder Details Schema
export const policyHolderSchema = z.object({
	PolicyholdersFirstName: z.string().min(1, "First name is required"),
	PolicyholdersLastName: z.string().min(1, "Last name is required"),
	PolicyholdersEmail: z.string().email("Invalid email address").optional(),
	PolicyholdersContactNumber: z.string().regex(/^(\+27|0)[6-8][0-9]{8}$/, {
		message: "Invalid phone number format",
	}),
});

// Vehicle Details Schema
export const vehicleDetailsSchema = z.object({
	mmcode: z.string().min(3, "Plate Number is required"),
	make: z.string().min(1, "Car Make is required"),
	year: z
		.number({
			required_error: "Year is required",
			invalid_type_error: "Year must be a number",
		})
		.min(1995, "Year must be 1995 or later")
		.max(2026, "Year must be 2026 or earlier"),
	model: z.string().min(1, "Model is required"),
	category: z.string().min(1, "Vehicle Category is required"),
	engineSize: z
		.number({
			required_error: "Engine Size is required",
			invalid_type_error: "Engine Size must be a number",
		})
		.min(1, { message: "Engine Size must be at least 1" })
		.max(10, { message: "Engine Size must be at most 10" }),
	status: z.string().min(1, "Car Status is required"),
	colour: z.string().min(1, "Colour is required"),
	nightPark: z.object({
		addressLine: z.string().min(1, "Address Line is required"),
		suburb: z.string().min(1, "Suburb is required"),
		postalCode: z.string().min(1, "Postal Code is required"),
	}),
	overnightParkingSituation: z.string().min(1, "Car Sleep is required"),
	typeOfNightPark: z.string().min(1, "Type Of Night Park is required"),
	accessControl: z
		.union([z.boolean(), z.string()])
		.transform((val) => val === true || val === "true"),
	securityGuard: z
		.union([z.boolean(), z.string()])
		.transform((val) => val === true || val === "true"),
	isOwner: z.boolean(),
	ownerVehicleDetails: z
		.object({
			ownersFirstName: z.string().min(1, "Owner's Name is required"),
			ownersLastName1: z.string().min(1, "Owner's Surname is required"),
			ownersContactNumber1: z
				.string()
				.regex(/^(\+27|0)[6-8][0-9]{8}$/, { message: "Invalid phone number" }),
			ownersIdNumber: z
				.string()
				.regex(/^\d{13}$/, "ID number must be 13 digits"),
			relationshipToOwner: z.string().min(1, "Relation to owner is required"),
		})
		.optional(),
	partyregularDriver: z.boolean(),
	regulardriverDetails: z
		.object({
			regularDriverFirstName: z.string().min(1, "Name is required"),
			regularDriverLastName: z.string().min(1, "Surname is required"),
			regularDriverContactNumber: z
				.string()
				.regex(/^(\+27|0)[6-8][0-9]{8}$/, { message: "Invalid phone number" }),
			regularDriverIdNumber: z
				.string()
				.regex(/^\d{13}$/, "ID number must be 13 digits"),
			relationToRegularDriver: z.string().min(1, "Relation is required"),
		})
		.optional(),
	isDisabled: z.boolean(),
	disabledDisability: z.string().optional(),
	usedFor: z.string().min(1, "Used for is required"),
	isAccessories: z.boolean(),
	accessoriesAmount: z.number().optional(),
	isFinanced: z.boolean(),
	financedBy: z.string().optional(),
	trackingDevice: z.boolean(),
	insuredValuetype: z.string().min(1, "Insured Value Type is required"),
	retailValue: z.number(),
	coverCode: z.string().min(1, "Cover Code is required"),
});

// Personal Details Schema
export const personalDetailsSchema = z.object({
	idNumber: z.string().regex(/^\d{13}$/, "ID number must be 13 digits"),
	maritalStatus: z.string().min(1, "Marital Status is required"),
	currentlyInsured: z.boolean(),
	employment: z.boolean(),
	licensetype: z.string().min(1, "License Type is required"),
	licenseIssueDate: z.string().min(1, "License Issue Date is required"),
	licenseRestrictions: z.string().min(1, "License restrictions is required"),
	isHomeAddressNightParkAddr: z.object({
		addressline: z.string().min(1, "Address Line is required"),
		suburb: z.string().min(1, "Suburb is required"),
		postalcode: z.string().min(1, "Postal Code is required"),
	}),
	yearsWithoutClaims: z.number(),
	relationToPolicyHolder: z
		.string()
		.min(1, "Relation to policy holder is required"),
	emailAddress: z.string().email("Invalid email address"),
	mobileNumber: z
		.string()
		.regex(/^(\+27|0)[6-8][0-9]{8}$/, { message: "Invalid phone number" }),
	isHadLosses: z.boolean(),
	ifClaimed: z
		.object({
			numOfClaims: z.number(),
			causeOfClaims: z.array(z.string()).min(1, "Select at least one cause"),
			costOfLosses: z.string().min(1, "Cost of Damage is required"),
			additionalDescription: z.string().optional(),
			isClaimsRejected: z.boolean(),
			ifClaimsRejected: z.array(z.string()).optional(),
		})
		.optional(),
});

// Main Quote Form Schema
export const quoteFormSchema = z.object({
	// Policyholder page
	...policyHolderSchema.shape,
	// Vehicle details page
	...vehicleDetailsSchema.shape,
	// Personal details page
	...personalDetailsSchema.shape,
});

// API response schema (unchanged)
export const apiResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
	quoteId: z.number().optional(),
	reference: z.string().optional(),
	timestamp: z.string().optional(),
	error: z.string().optional(),
	code: z.number().optional(),
});
