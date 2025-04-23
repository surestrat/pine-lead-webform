import QuestionRow from "@components/form/QuestionRow";
import SectionHeader from "@components/form/SectionHeader";
import FormSection from "@components/form/FormSection";
import { InputField, SelectField } from "@components/form/FormField";
import { User, Phone, Mail, CreditCard } from "lucide-react";
import {
	maritalOptions,
	licenseTypeOptions,
	licenseRestrictionOptions,
	relationToPolicyHolderOptions,
} from "@constants/formOptions";
import { useState } from "react"; // <-- add useState

const PersonalSection = ({
	openSections,
	toggleSection,
	register,
	errors,
	fields = [],
	watch,
}) => {
	const values = watch ? watch() : {};
	const getVal = (name) => {
		if (!name.includes(".")) return values?.[name];
		return name.split(".").reduce((acc, key) => acc && acc[key], values);
	};
	const getErr = (name) => {
		if (!name.includes(".")) return errors?.[name];
		return name.split(".").reduce((acc, key) => acc && acc[key], errors);
	};

	const isHadLosses = getVal("isHadLosses");

	// Prefill logic for owner fields if user is owner
	const isOwner = getVal("isOwner");
	const policyFirstName = getVal("PolicyholdersFirstName") || "";
	const policyLastName = getVal("PolicyholdersLastName") || "";
	const policyContact = getVal("PolicyholdersContactNumber") || "";
	const policyId = getVal("idNumber") || "";

	// --- NEW LOGIC FOR NIGHT PARK/HOME ADDRESS ---
	const nightParkAddress = {
		addressline: getVal("nightPark.addressLine") || "",
		suburb: getVal("nightPark.suburb") || "",
		postalcode: getVal("nightPark.postalCode") || "",
	};
	const [useNightParkAsHome, setUseNightParkAsHome] = useState(false);

	const handleNightParkAsHomeChange = (e) => {
		const checked = e.target.checked;
		setUseNightParkAsHome(checked);
		// Optionally, you could set values here if using a form library with setValue
	};

	return (
		<div>
			<SectionHeader
				title="Personal Information"
				section="personal"
				isOpen={openSections.personal}
				icon={User}
				toggleSection={toggleSection}
			/>
			<FormSection isOpen={openSections.personal}>
				{/* Policyholder fields */}
				{fields.includes("PolicyholdersFirstName") && (
					<QuestionRow
						question="Policyholder's First Name"
						name="PolicyholdersFirstName"
						value={getVal("PolicyholdersFirstName")}
						error={getErr("PolicyholdersFirstName")}
					>
						<InputField
							register={register}
							name="PolicyholdersFirstName"
							placeholder="e.g. John"
							icon={User}
							required={true}
							errors={errors}
							autoComplete="given-name"
							helperText="Enter the policyholder's first name as per ID."
							defaultValue={policyFirstName}
						/>
					</QuestionRow>
				)}
				{fields.includes("PolicyholdersLastName") && (
					<QuestionRow
						question="Policyholder's Last Name"
						name="PolicyholdersLastName"
						value={getVal("PolicyholdersLastName")}
						error={getErr("PolicyholdersLastName")}
					>
						<InputField
							register={register}
							name="PolicyholdersLastName"
							placeholder="e.g. Doe"
							icon={User}
							required={true}
							errors={errors}
							autoComplete="family-name"
							helperText="Enter the policyholder's surname as per ID."
							defaultValue={policyLastName}
						/>
					</QuestionRow>
				)}
				{fields.includes("PolicyholdersEmail") && (
					<QuestionRow
						question="Policyholder's Email Address"
						name="PolicyholdersEmail"
						value={getVal("PolicyholdersEmail")}
						error={getErr("PolicyholdersEmail")}
					>
						<InputField
							register={register}
							name="PolicyholdersEmail"
							placeholder="e.g. john.doe@email.com"
							type="email"
							icon={Mail}
							errors={errors}
							autoComplete="email"
							helperText="Enter a valid email address for correspondence."
							defaultValue={getVal("PolicyholdersEmail") || ""}
						/>
					</QuestionRow>
				)}
				{fields.includes("PolicyholdersContactNumber") && (
					<QuestionRow
						question="Policyholder's Contact Number"
						name="PolicyholdersContactNumber"
						value={getVal("PolicyholdersContactNumber")}
						error={getErr("PolicyholdersContactNumber")}
					>
						<InputField
							register={register}
							name="PolicyholdersContactNumber"
							placeholder="e.g. 0821234567"
							icon={Phone}
							required={true}
							errors={errors}
							inputMode="tel"
							autoComplete="tel"
							helperText="South African mobile number, e.g. 0821234567 or +27821234567"
							defaultValue={policyContact}
						/>
					</QuestionRow>
				)}
				{fields.includes("idNumber") && (
					<QuestionRow
						question="Customer's South African ID Number"
						name="idNumber"
						value={getVal("idNumber")}
						error={getErr("idNumber")}
					>
						<InputField
							register={register}
							name="idNumber"
							placeholder="e.g. 8001015009087"
							icon={CreditCard}
							required={true}
							errors={errors}
							inputMode="numeric"
							autoComplete="off"
							helperText="13 digits, as per South African ID document."
							defaultValue={policyId}
						/>
					</QuestionRow>
				)}
				{fields.includes("maritalStatus") && (
					<QuestionRow
						question="Marital Status"
						name="maritalStatus"
						value={getVal("maritalStatus")}
						error={getErr("maritalStatus")}
					>
						<SelectField
							register={register}
							name="maritalStatus"
							placeholder="Select marital status"
							options={maritalOptions}
							errors={errors}
							required={true}
							helperText="Choose the current marital status of the customer."
						/>
					</QuestionRow>
				)}
				{fields.includes("currentlyInsured") && (
					<QuestionRow
						question="Is the customer currently insured?"
						name="currentlyInsured"
						value={getVal("currentlyInsured")}
						error={getErr("currentlyInsured")}
					>
						<SelectField
							register={register}
							name="currentlyInsured"
							placeholder="Currently insured?"
							options={[
								{ value: true, label: "Yes" },
								{ value: false, label: "No" },
							]}
							errors={errors}
							required={true}
							helperText="Select 'Yes' if the customer has active insurance."
							switchMode
							watch={watch}
							registerOptions={{
								valueAsBoolean: true,
							}}
						/>
					</QuestionRow>
				)}
				{fields.includes("employment") && (
					<QuestionRow
						question="Employment Status"
						name="employment"
						value={getVal("employment")}
						error={getErr("employment")}
					>
						<SelectField
							register={register}
							name="employment"
							placeholder="Employed?"
							options={[
								{ value: true, label: "Employed" },
								{ value: false, label: "Unemployed" },
							]}
							errors={errors}
							required={true}
							helperText="Is the customer currently employed?"
							switchMode
							watch={watch}
							registerOptions={{
								valueAsBoolean: true,
							}}
						/>
					</QuestionRow>
				)}
				{fields.includes("licensetype") && (
					<QuestionRow
						question="Driver's License Type"
						name="licensetype"
						value={getVal("licensetype")}
						error={getErr("licensetype")}
					>
						<SelectField
							register={register}
							name="licensetype"
							placeholder="License type"
							options={licenseTypeOptions}
							errors={errors}
							required={true}
							helperText="Select the code as shown on the license card."
						/>
					</QuestionRow>
				)}
				{fields.includes("licenseIssueDate") && (
					<QuestionRow
						question="Date License Was Issued"
						name="licenseIssueDate"
						value={getVal("licenseIssueDate")}
						error={getErr("licenseIssueDate")}
					>
						<InputField
							register={register}
							name="licenseIssueDate"
							placeholder="YYYY-MM-DD"
							type="date"
							required={true}
							errors={errors}
							autoComplete="off"
							helperText="Enter the date as per the license card."
						/>
					</QuestionRow>
				)}
				{fields.includes("licenseRestrictions") && (
					<QuestionRow
						question="License Restrictions"
						name="licenseRestrictions"
						value={getVal("licenseRestrictions")}
						error={getErr("licenseRestrictions")}
					>
						<SelectField
							register={register}
							name="licenseRestrictions"
							placeholder="Any restrictions?"
							options={licenseRestrictionOptions}
							errors={errors}
							required={true}
							helperText="Specify if there are any restrictions on the license."
						/>
					</QuestionRow>
				)}

				{fields.includes("isHomeAddressNightParkAddr") && (
					<>
						{/* --- NEW: Night park address same as home address switch --- */}
						<div className="mb-4 flex items-center gap-3">
							<input
								type="checkbox"
								id="nightParkSameAsHome"
								checked={useNightParkAsHome}
								onChange={handleNightParkAsHomeChange}
								className="w-4 h-4 border-gray-300 rounded text-teal-600 focus:ring-teal-500"
							/>
							<label
								htmlFor="nightParkSameAsHome"
								className="text-sm text-gray-700"
							>
								Is the home address the same as your night park address?
							</label>
						</div>

						{/* --- Home address fields: show only if NOT using night park as home --- */}
						{!useNightParkAsHome && (
							<>
								<QuestionRow
									question="Customer's Home Address"
									name="isHomeAddressNightParkAddr.addressline"
									value={getVal("isHomeAddressNightParkAddr.addressline")}
									error={getErr("isHomeAddressNightParkAddr")?.addressline}
								>
									<InputField
										register={register}
										name="isHomeAddressNightParkAddr.addressline"
										placeholder="e.g. 123 Main Str"
										required={true}
										errors={
											errors?.isHomeAddressNightParkAddr?.addressline
												? {
														isHomeAddressNightParkAddr: {
															addressline:
																errors.isHomeAddressNightParkAddr.addressline,
														},
												  }
												: errors
										}
										helperText="Street address where the customer resides."
									/>
								</QuestionRow>
								<QuestionRow
									question="Home Suburb"
									name="isHomeAddressNightParkAddr.suburb"
									value={getVal("isHomeAddressNightParkAddr.suburb")}
									error={getErr("isHomeAddressNightParkAddr")?.suburb}
								>
									<InputField
										register={register}
										name="isHomeAddressNightParkAddr.suburb"
										placeholder="e.g. Sandton"
										required={true}
										errors={
											errors?.isHomeAddressNightParkAddr?.suburb
												? {
														isHomeAddressNightParkAddr: {
															suburb: errors.isHomeAddressNightParkAddr.suburb,
														},
												  }
												: errors
										}
										helperText="Suburb or area name."
									/>
								</QuestionRow>
								<QuestionRow
									question="Home Postal Code"
									name="isHomeAddressNightParkAddr.postalcode"
									value={getVal("isHomeAddressNightParkAddr.postalcode")}
									error={getErr("isHomeAddressNightParkAddr")?.postalcode}
								>
									<InputField
										register={register}
										name="isHomeAddressNightParkAddr.postalcode"
										placeholder="e.g. 2196"
										required={true}
										errors={
											errors?.isHomeAddressNightParkAddr?.postalcode
												? {
														isHomeAddressNightParkAddr: {
															postalcode:
																errors.isHomeAddressNightParkAddr.postalcode,
														},
												  }
												: errors
										}
										helperText="4-digit postal code."
										inputMode="numeric"
									/>
								</QuestionRow>
							</>
						)}

						{/* --- If using night park as home, show a summary (optional) --- */}
						{useNightParkAsHome && (
							<div className="mb-4 p-3 bg-gray-50 rounded border text-gray-700 text-sm">
								<strong>
									Home address will be set to your night park address:
								</strong>
								<div>
									Address:{" "}
									{nightParkAddress.addressline || <em>Not provided</em>}
								</div>
								<div>
									Suburb: {nightParkAddress.suburb || <em>Not provided</em>}
								</div>
								<div>
									Postal Code:{" "}
									{nightParkAddress.postalcode || <em>Not provided</em>}
								</div>
							</div>
						)}
					</>
				)}
				{fields.includes("yearsWithoutClaims") && (
					<QuestionRow
						question="Years Without Insurance Claims"
						name="yearsWithoutClaims"
						value={getVal("yearsWithoutClaims")}
						error={getErr("yearsWithoutClaims")}
					>
						<InputField
							register={register}
							name="yearsWithoutClaims"
							placeholder="e.g. 5"
							type="number"
							required={true}
							errors={errors}
							min={0}
							max={50}
							inputMode="numeric"
							helperText="How many years since the last claim? (0 if recent)"
							registerOptions={{
								valueAsNumber: true,
							}}
						/>
					</QuestionRow>
				)}
				{fields.includes("relationToPolicyHolder") && (
					<QuestionRow
						question="Relation to Policyholder"
						name="relationToPolicyHolder"
						value={getVal("relationToPolicyHolder")}
						error={getErr("relationToPolicyHolder")}
					>
						<SelectField
							register={register}
							name="relationToPolicyHolder"
							placeholder="e.g. Self, Spouse"
							options={relationToPolicyHolderOptions}
							errors={errors}
							required={true}
							helperText="Is the customer the policyholder or related?"
						/>
					</QuestionRow>
				)}

				{fields.includes("isHadLosses") && (
					<QuestionRow
						question="Has the customer had insurance losses in the last 5 years?"
						name="isHadLosses"
						value={getVal("isHadLosses")}
						error={getErr("isHadLosses")}
					>
						<SelectField
							register={register}
							name="isHadLosses"
							placeholder="Any losses in last 5 years?"
							options={[
								{ value: true, label: "Yes" },
								{ value: false, label: "No" },
							]}
							errors={errors}
							required={true}
							helperText="Select 'Yes' if the customer has claimed in the last 5 years."
							switchMode
							watch={watch}
							registerOptions={{
								valueAsBoolean: true,
							}}
						/>
					</QuestionRow>
				)}
				{fields.includes("ifClaimed") && isHadLosses === "true" && (
					<div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-6">
						<h4 className="font-semibold mb-2 flex items-center gap-2">
							<CreditCard className="w-4 h-4 text-blue-600" />
							Details of Claims
						</h4>
						<QuestionRow
							question="Number of Claims"
							name="ifClaimed.numOfClaims"
							value={getVal("ifClaimed.numOfClaims")}
							error={getErr("ifClaimed")?.numOfClaims}
						>
							<InputField
								register={register}
								name="ifClaimed.numOfClaims"
								placeholder="e.g. 2"
								type="number"
								icon={CreditCard}
								required={true}
								errors={
									errors?.ifClaimed?.numOfClaims
										? {
												ifClaimed: {
													numOfClaims: errors.ifClaimed.numOfClaims,
												},
										  }
										: errors
								}
								min={0}
								max={20}
								inputMode="numeric"
								helperText="Total number of claims made in the last 5 years."
							/>
						</QuestionRow>
						<QuestionRow
							question="Cause(s) of Claims"
							name="ifClaimed.causeOfClaims"
							value={getVal("ifClaimed.causeOfClaims")}
							error={getErr("ifClaimed")?.causeOfClaims}
						>
							<SelectField
								register={register}
								name="ifClaimed.causeOfClaims"
								placeholder="Select cause(s) of claims"
								options={[
									{ value: "accidentalDamage", label: "Accidental Damage" },
									{ value: "damageToOthers", label: "Damage to others" },
									{ value: "fire", label: "Fire" },
									{ value: "motherNature", label: "Mother Nature" },
									{ value: "theftAndHijack", label: "Theft and Highjack" },
									{ value: "other", label: "Other" },
								]}
								icon={CreditCard}
								errors={
									errors?.ifClaimed?.causeOfClaims
										? {
												ifClaimed: {
													causeOfClaims: errors.ifClaimed.causeOfClaims,
												},
										  }
										: errors
								}
								required={true}
								helperText="Select all applicable causes for the claims."
							/>
						</QuestionRow>
						<QuestionRow
							question="Estimated Cost of Damage"
							name="ifClaimed.costOfLosses"
							value={getVal("ifClaimed.costOfLosses")}
							error={getErr("ifClaimed")?.costOfLosses}
						>
							<InputField
								register={register}
								name="ifClaimed.costOfLosses"
								placeholder="e.g. 5000"
								type="number"
								icon={CreditCard}
								required={true}
								errors={
									errors?.ifClaimed?.costOfLosses
										? {
												ifClaimed: {
													costOfLosses: errors.ifClaimed.costOfLosses,
												},
										  }
										: errors
								}
								inputMode="decimal"
								helperText="Estimated total cost of all claims (ZAR)."
							/>
						</QuestionRow>
						<QuestionRow
							question="Brief Description of Claims"
							name="ifClaimed.additionalDescription"
							value={getVal("ifClaimed.additionalDescription")}
							error={getErr("ifClaimed")?.additionalDescription}
						>
							<InputField
								register={register}
								name="ifClaimed.additionalDescription"
								placeholder="e.g. Rear-ended at traffic light"
								icon={CreditCard}
								errors={
									errors?.ifClaimed?.additionalDescription
										? {
												ifClaimed: {
													additionalDescription:
														errors.ifClaimed.additionalDescription,
												},
										  }
										: errors
								}
								helperText="Short summary of the claim circumstances."
							/>
						</QuestionRow>
						<QuestionRow
							question="Was any claim rejected?"
							name="ifClaimed.isClaimsRejected"
							value={getVal("ifClaimed.isClaimsRejected")}
							error={getErr("ifClaimed")?.isClaimsRejected}
						>
							<SelectField
								register={register}
								name="ifClaimed.isClaimsRejected"
								placeholder="Any claim rejected?"
								options={[
									{ value: "true", label: "Yes" },
									{ value: "false", label: "No" },
								]}
								icon={CreditCard}
								errors={
									errors?.ifClaimed?.isClaimsRejected
										? {
												ifClaimed: {
													isClaimsRejected: errors.ifClaimed.isClaimsRejected,
												},
										  }
										: errors
								}
								required={true}
								helperText="Select 'Yes' if any claim was declined by the insurer."
							/>
						</QuestionRow>
					</div>
				)}
			</FormSection>
		</div>
	);
};

export default PersonalSection;
