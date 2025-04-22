import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quoteFormSchema } from "@schemas/quoteFormSchema";
import { handleQuoteSubmission, sendSureStratQuote } from "@utils/api";
import { logger } from "@utils/logger";
import { useFormWithValidation } from "@hooks/useFormWithValidation";
import {
	ArrowRight,
	CheckSquare,
	ArrowLeft,
	Shield,
	FileText,
	User,
	Phone,
	Mail,
	MapPin,
	RefreshCw,
	Lock,
	Clock,
	Sparkles,
	Car, // <-- Add this line
} from "lucide-react";

// UI Components
import PillHeader from "@components/ui/PillHeader";
import Heading from "@components/ui/Heading";
import SubHeading from "@components/ui/SubHeading";
import FormBackdrop from "@components/ui/FormBackdrop";

// Import all form components from the index file
import {
	PersonalSection,
	VehicleSection,
	TermsSection,
	SubmitButton,
	ProgressIndicator,
	ErrorReporter,
	SuccessAlert,
	SectionDivider,
} from "@components/form";

const QuoteForm = () => {
	logger.log("📋 QuoteForm component rendered");

	// State management
	const [currentStep, setCurrentStep] = useState(0);
	const [openSections, setOpenSections] = useState({
		personal: true,
		vehicle: false,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [quoteReference, setQuoteReference] = useState(null);
	const [apiResponse, setApiResponse] = useState(null);

	// Add this to avoid the ReferenceError
	const insuranceTypes = []; // or derive from form state if needed

	// Form handling with our custom hook
	const {
		register,
		watch,
		reset,
		trigger,
		getValues,
		formState: { errors },
		handleSubmitSafe,
	} = useFormWithValidation(quoteFormSchema, {
		accessControl: false,
		securityGuard: false,
		isOwner: false,
		partyregularDriver: false,
		isDisabled: false,
		isAccessories: false,
		isFinanced: false,
		trackingDevice: false,
		currentlyInsured: false,
		employment: false,
		isHadLosses: false,
		// Add other boolean fields as needed
	});

	// Log form errors whenever they change
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			logger.warn("🚨 Form validation errors:", errors);
		}
	}, [errors]);

	// Define steps for the form wizard
	const steps = [
		{
			id: "policyholder",
			title: "Policyholder Details",
			description: "Tell us about the policyholder",
			fields: [
				"PolicyholdersFirstName",
				"PolicyholdersLastName",
				"PolicyholdersEmail",
				"PolicyholdersContactNumber",
			],
			icon: User,
		},
		{
			id: "vehicle",
			title: "Vehicle Details",
			description: "Tell us about your vehicle",
			fields: [
				"mmcode",
				"make",
				"year",
				"model",
				"category",
				"engineSize",
				"status",
				"colour",
				"nightPark",
				"overnightParkingSituation",
				"typeOfNightPark",
				"accessControl",
				"securityGuard",
				"isOwner",
				"ownerVehicleDetails",
				"partyregularDriver",
				"regulardriverDetails",
				"isDisabled",
				"disabledDisability",
				"usedFor",
				"isAccessories",
				"accessoriesAmount",
				"isFinanced",
				"financedBy",
				"trackingDevice",
				"insuredValuetype",
				"retailValue",
				"coverCode",
			],
			icon: Car,
		},
		{
			id: "personal",
			title: "Personal Details",
			description: "Tell us about yourself",
			fields: [
				"idNumber",
				"maritalStatus",
				"currentlyInsured",
				"employment",
				"licensetype",
				"licenseIssueDate",
				"licenseRestrictions",
				"isHomeAddressNightParkAddr",
				"yearsWithoutClaims",
				"relationToPolicyHolder",
				"emailAddress",
				"mobileNumber",
				"isHadLosses",
				"ifClaimed",
			],
			icon: User,
		},
		{
			id: "review",
			title: "Review & Submit",
			description: "Finalize your request",
			fields: ["termsAccepted"],
			icon: CheckSquare,
		},
	];

	const toggleSection = (section) => {
		logger.debug(`🔄 Toggling section: ${section}`);
		setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
	};

	const goToNextStep = async () => {
		const stepFields = steps[currentStep].fields;
		let fieldsToValidate = stepFields;

		// Dynamically filter fields for the vehicle step
		if (steps[currentStep].id === "vehicle") {
			const values = getValues();
			fieldsToValidate = [
				"mmcode",
				"make",
				"year",
				"model",
				"category",
				"engineSize",
				"status",
				"colour",
				"nightPark",
				"overnightParkingSituation",
				"typeOfNightPark",
				"accessControl",
				"securityGuard",
				"isOwner",
				...(values.isOwner === false
					? [
							"ownerVehicleDetails.ownersFirstName",
							"ownerVehicleDetails.ownersLastName1",
							"ownerVehicleDetails.ownersContactNumber1",
							"ownerVehicleDetails.ownersIdNumber",
							"ownerVehicleDetails.relationshipToOwner",
					  ]
					: []),
				"partyregularDriver",
				...(values.partyregularDriver === false
					? [
							"regulardriverDetails.regularDriverFirstName",
							"regulardriverDetails.regularDriverLastName",
							"regulardriverDetails.regularDriverContactNumber",
							"regulardriverDetails.regularDriverIdNumber",
							"regulardriverDetails.relationToRegularDriver",
					  ]
					: []),
				"isDisabled",
				...(values.isDisabled === true ? ["disabledDisability"] : []),
				"usedFor",
				"isAccessories",
				...(values.isAccessories === true ? ["accessoriesAmount"] : []),
				"isFinanced",
				...(values.isFinanced === true ? ["financedBy"] : []),
				"trackingDevice",
				"insuredValuetype",
				"retailValue",
				"coverCode",
			];
		}

		// Dynamically filter fields for the personal step
		if (steps[currentStep].id === "personal") {
			const values = getValues();
			fieldsToValidate = [
				"idNumber",
				"maritalStatus",
				"currentlyInsured",
				"employment",
				"licensetype",
				"licenseIssueDate",
				"licenseRestrictions",
				"isHomeAddressNightParkAddr",
				"yearsWithoutClaims",
				"relationToPolicyHolder",
				"emailAddress",
				"mobileNumber",
				"isHadLosses",
				...(values.isHadLosses === true
					? [
							"ifClaimed.numOfClaims",
							"ifClaimed.causeOfClaims",
							"ifClaimed.costOfLosses",
							"ifClaimed.additionalDescription",
							"ifClaimed.isClaimsRejected",
							"ifClaimed.ifClaimsRejected",
					  ]
					: []),
			];
		}

		logger.debug("🔎 Validating step fields:", fieldsToValidate);
		if (fieldsToValidate && fieldsToValidate.length > 0) {
			const isStepValid = await trigger(fieldsToValidate);
			logger.debug("✅ Step validation result:", isStepValid, errors);
			if (!isStepValid) {
				logger.warn("❌ Step validation failed", errors);
				return;
			}
		}

		// Move to next step and update section visibility
		if (currentStep < steps.length - 1) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			setCurrentStep(currentStep + 1);

			// Update visible sections based on step
			if (currentStep === 0) {
				setOpenSections({
					personal: false,
					vehicle: true,
				});
			} else if (currentStep === 1) {
				setOpenSections({
					personal: true,
					vehicle: false,
				});
			}
		}
	};

	// Handle previous step
	const goToPrevStep = () => {
		if (currentStep > 0) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			setCurrentStep(currentStep - 1);

			// Update visible sections based on step
			if (currentStep === 1) {
				setOpenSections({
					personal: true,
					vehicle: false,
				});
			} else if (currentStep === 2) {
				setOpenSections({
					personal: false,
					vehicle: true,
				});
			}
		}
	};

	const onSubmit = async (data) => {
		logger.info("📝 Form submission started with data:", data);

		try {
			// Build payload for SureStrat API
			const payload = {
				source: "SureStrat",
				externalReferenceId: "string", // You may want to generate or map this
				vehicles: [
					{
						year: data.year || 0,
						make: data.make || "",
						model: data.model || "",
						mmCode: data.mmcode || "",
						modified: "N",
						category: data.category || "",
						colour: data.colour || "",
						engineSize: data.engineSize || 0,
						financed: data.isFinanced === true ? "Y" : "N",
						owner: data.isOwner === true ? "Y" : "N",
						status: data.status || "",
						partyIsRegularDriver: data.partyregularDriver === false ? "N" : "Y",
						accessories: data.isAccessories === true ? "Y" : "N",
						accessoriesAmount: data.accessoriesAmount || 0,
						retailValue: data.retailValue || 0,
						marketValue: 0, // Map if you have this
						insuredValueType: data.insuredValuetype || "",
						useType: data.usedFor || "",
						overnightParkingSituation: data.overnightParkingSituation || "",
						coverCode: data.coverCode || "",
						address: {
							addressLine: data.nightPark?.addressLine || "",
							postalCode: Number(data.nightPark?.postalCode) || 0,
							suburb: data.nightPark?.suburb || "",
							latitude: 0,
							longitude: 0,
							additionalProp1: {},
						},
						regularDriver: {
							maritalStatus: data.maritalStatus || "",
							currentlyInsured: data.currentlyInsured ?? false,
							yearsWithoutClaims: data.yearsWithoutClaims || 0,
							relationToPolicyHolder: data.relationToPolicyHolder || "",
							emailAddress: data.emailAddress || "",
							mobileNumber: data.mobileNumber || "",
							idNumber: data.idNumber || "",
							prvInsLosses: data.isHadLosses ? 1 : 0,
							licenseIssueDate: data.licenseIssueDate || "",
							dateOfBirth: "", // Map if you have this
							additionalProp1: {},
						},
						additionalProp1: {},
					},
				],
				additionalProp1: {},
			};

			const result = await sendSureStratQuote(payload);
			setApiResponse(result);

			logger.info("✅ API submission completed successfully");
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (error) {
			logger.error("❌ API submission error:", error);
			setApiResponse(error);
			setSubmitError(error.message || "An unexpected error occurred");
			setIsSubmitting(false);
		}
	};

	const formVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	const stepVariants = {
		hidden: { opacity: 0, x: 20 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.4, ease: "easeOut" },
		},
		exit: {
			opacity: 0,
			x: -20,
			transition: { duration: 0.3 },
		},
	};

	// Show a responsive step title
	const getStepTitle = () => {
		const step = steps[currentStep];
		return (
			<div className="flex flex-col items-start">
				<div className="flex items-center text-blue-100 text-sm mb-1">
					<span>
						Step {currentStep + 1} of {steps.length}:{" "}
					</span>
					<span className="ml-1 font-medium">{step.description}</span>
				</div>
				<h2 className="text-xl font-semibold flex items-center">
					{step.icon && <step.icon className="w-5 h-5 mr-2" />}
					{step.title}
				</h2>
			</div>
		);
	};

	// If form is successfully submitted, show success screen
	if (submitSuccess) {
		return (
			<FormBackdrop>
				<div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<motion.div
						initial="hidden"
						animate="visible"
						variants={formVariants}
						className="text-center max-w-3xl mx-auto"
					>
						<PillHeader name="Get Started Today" />
						<Heading whiteText="Thank You" blueText="For Your Request" />
						<SubHeading text="Your insurance quote request has been submitted successfully. Our team will be in touch with you shortly." />
					</motion.div>

					<motion.div
						initial="hidden"
						animate="visible"
						variants={formVariants}
						className="max-w-xl mx-auto mt-8"
					>
						<SuccessAlert
							message="Your quote has been submitted successfully!"
							reference={quoteReference}
						/>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className="mt-8 text-center"
						>
							<a
								href="/"
								className="inline-flex items-center px-4 py-2 text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50"
							>
								Return to Home
							</a>
						</motion.div>
					</motion.div>
				</div>
			</FormBackdrop>
		);
	}

	return (
		<FormBackdrop>
			<div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<motion.div
					initial="hidden"
					animate="visible"
					variants={formVariants}
					className="text-center max-w-3xl mx-auto"
				>
					<PillHeader name="Get Started Today" />
					<Heading whiteText="Quick & Easy" blueText="Insurance Quote" />
					<SubHeading text="Get a comprehensive insurance quote tailored to your needs in minutes. Our digital process makes it simple and hassle-free." />
				</motion.div>

				{/* Progress Bar */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="max-w-3xl mx-auto mt-8"
				>
					<ProgressIndicator
						steps={steps}
						currentStep={currentStep}
						setCurrentStep={setCurrentStep}
					/>
				</motion.div>

				<motion.div
					initial="hidden"
					animate="visible"
					variants={formVariants}
					className="max-w-3xl mx-auto mt-8 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200/60"
				>
					<form onSubmit={handleSubmitSafe(onSubmit)} className="relative">
						{/* Form Header */}
						<div className="bg-gradient-to-r from-teal-600 to-teal-500 py-6 px-8 text-white">
							{getStepTitle()}
						</div>

						{/* Error display at top */}
						{submitError && (
							<div className="px-8 pt-6">
								<ErrorReporter
									error={submitError}
									onDismiss={() => setSubmitError(null)}
								/>
							</div>
						)}

						{/* Form Content */}
						<div className="p-8 pt-4">
							<AnimatePresence mode="wait">
								<motion.div
									key={`step-${currentStep}`}
									initial="hidden"
									animate="visible"
									exit="exit"
									variants={stepVariants}
									className="space-y-6"
								>
									{/* Step 1: Policyholder Details */}
									{currentStep === 0 && (
										<PersonalSection
											openSections={{ personal: true }}
											toggleSection={() => {}}
											register={register}
											errors={errors}
											// Only render Policyholder fields
											fields={[
												"PolicyholdersFirstName",
												"PolicyholdersLastName",
												"PolicyholdersEmail",
												"PolicyholdersContactNumber",
											]}
											watch={watch}
										/>
									)}

									{/* Step 2: Vehicle Details */}
									{currentStep === 1 && (
										<VehicleSection
											openSections={{ vehicle: true }}
											toggleSection={() => {}}
											register={register}
											errors={errors}
											watch={watch}
										/>
									)}

									{/* Step 3: Personal Details */}
									{currentStep === 2 && (
										<PersonalSection
											openSections={{ personal: true }}
											toggleSection={() => {}}
											register={register}
											errors={errors}
											// Only render Personal Details fields
											fields={[
												"idNumber",
												"maritalStatus",
												"currentlyInsured",
												"employment",
												"licensetype",
												"licenseIssueDate",
												"licenseRestrictions",
												"isHomeAddressNightParkAddr",
												"yearsWithoutClaims",
												"relationToPolicyHolder",
												"emailAddress",
												"mobileNumber",
												"isHadLosses",
												"ifClaimed",
											]}
											watch={watch}
										/>
									)}

									{/* Step 4: Terms & Submit */}
									{currentStep === 3 && (
										<>
											<div className="bg-blue-50/50 p-6 rounded-xl mb-6">
												<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
													<FileText className="w-5 h-5 mr-2 text-blue-600" />
													Quote Summary
												</h3>
												{/* Show the raw API response if available */}
												{apiResponse && (
													<div className="bg-white p-4 rounded-md border border-gray-200 mb-4 text-left">
														<p className="text-sm font-medium text-gray-700 mb-2">
															API Response:
														</p>
														<pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
															{typeof apiResponse === "object"
																? JSON.stringify(apiResponse, null, 2)
																: String(apiResponse)}
														</pre>
													</div>
												)}
												{Object.keys(errors).length > 0 && (
													<div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
														<strong>Validation Errors:</strong>
														<pre className="text-xs mt-1 whitespace-pre-wrap">
															{JSON.stringify(errors, null, 2)}
														</pre>
													</div>
												)}
												{/* Optionally, show a summary of form values here */}
												{/* ...existing summary UI... */}
											</div>
											<TermsSection register={register} errors={errors} />
										</>
									)}
								</motion.div>
							</AnimatePresence>

							{/* Navigation Buttons */}
							<div className="flex justify-between mt-8">
								{currentStep > 0 ? (
									<button
										type="button"
										className="flex items-center px-4 py-2 text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50"
										onClick={goToPrevStep}
										disabled={isSubmitting}
									>
										<ArrowLeft className="w-4 h-4 mr-2" />
										Back
									</button>
								) : (
									<div></div>
								)}

								{currentStep < steps.length - 1 ? (
									<button
										type="button"
										className="flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
										onClick={goToNextStep}
									>
										Continue
										<ArrowRight className="w-4 h-4 ml-2" />
									</button>
								) : (
									<SubmitButton
										isSubmitting={isSubmitting}
										submitSuccess={submitSuccess}
										onClick={() => logger.debug("🖱️ Submit button clicked")}
									/>
								)}
							</div>
						</div>
					</form>
				</motion.div>

				{/* Trust indicators */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className="max-w-3xl mx-auto mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600"
				>
					<div className="flex items-center">
						<Clock className="w-4 h-4 mr-2 text-blue-600" />
						<span>2 minute process</span>
					</div>
					<div className="flex items-center">
						<RefreshCw className="w-4 h-4 mr-2 text-blue-600" />
						<span>No obligation</span>
					</div>
					<div className="flex items-center">
						<Lock className="w-4 h-4 mr-2 text-blue-600" />
						<span>256-bit encryption</span>
					</div>
					<div className="flex items-center">
						<Shield className="w-4 h-4 mr-2 text-blue-600" />
						<span>POPI Act Compliant</span>
					</div>
					<div className="flex items-center">
						<Sparkles className="w-4 h-4 mr-2 text-blue-600" />
						<span>Free service</span>
					</div>
				</motion.div>
			</div>
		</FormBackdrop>
	);
};

export default QuoteForm;
