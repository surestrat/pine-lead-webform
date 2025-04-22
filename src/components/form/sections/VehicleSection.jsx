import QuestionRow from "@components/form/QuestionRow";
import SectionHeader from "@components/form/SectionHeader";
import FormSection from "@components/form/FormSection";
import { InputField, SelectField } from "@components/form/FormField";
import SectionDivider from "@components/form/SectionDivider";
import {
	Car,
	Hash,
	FileType,
	Calendar,
	Palette,
	Lock,
	Shield,
	User,
	Phone,
	CreditCard,
} from "lucide-react";
import {
	categoryOptions,
	statusOptions,
	colourOptions,
	typeOfNightParkOptions,
	usedForOptions,
} from "@constants/formOptions";
import { useState } from "react";

const VehicleSection = ({
	openSections,
	toggleSection,
	register,
	errors,
	watch,
}) => {
	const values = watch ? watch() : {};
	const getVal = (name) => {
		// Support nested fields like "nightPark.addressLine"
		if (!name.includes(".")) return values?.[name];
		return name.split(".").reduce((acc, key) => acc && acc[key], values);
	};
	const getErr = (name) => {
		if (!name.includes(".")) return errors?.[name];
		return name.split(".").reduce((acc, key) => acc && acc[key], errors);
	};

	// Convert string "true"/"false" to boolean for boolean fields
	const boolVal = (val) =>
		val === true || val === false
			? val
			: val === "true"
			? true
			: val === "false"
			? false
			: val;

	const isOwner = boolVal(getVal("isOwner"));
	const partyregularDriver = boolVal(getVal("partyregularDriver"));
	const isDisabled = boolVal(getVal("isDisabled"));
	const isAccessories = boolVal(getVal("isAccessories"));
	const isFinanced = boolVal(getVal("isFinanced"));

	// Prefill owner details from policyholder if isOwner === true
	const policyFirstName = getVal("PolicyholdersFirstName") || "";
	const policyLastName = getVal("PolicyholdersLastName") || "";
	const policyContact = getVal("PolicyholdersContactNumber") || "";
	const policyId = getVal("idNumber") || "";

	// Prefill logic for nightPark address from home address
	const homeAddress = getVal("isHomeAddressNightParkAddr") || {};
	const [useHomeForNightPark, setUseHomeForNightPark] = useState(false);

	const handleNightParkSwitch = (e) => {
		const checked = e.target.checked;
		setUseHomeForNightPark(checked);
		if (checked) {
			// Prefill nightPark fields with home address
			register("nightPark.addressLine").onChange({
				target: {
					name: "nightPark.addressLine",
					value: homeAddress.addressline || "",
				},
				type: "change",
			});
			register("nightPark.suburb").onChange({
				target: { name: "nightPark.suburb", value: homeAddress.suburb || "" },
				type: "change",
			});
			register("nightPark.postalCode").onChange({
				target: {
					name: "nightPark.postalCode",
					value: homeAddress.postalcode || "",
				},
				type: "change",
			});
		}
	};

	return (
		<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
			<SectionHeader
				title="Vehicle Details"
				section="vehicle"
				isOpen={openSections.vehicle}
				icon={Car}
				toggleSection={toggleSection}
			/>
			<FormSection isOpen={openSections.vehicle}>
				<SectionDivider text="Vehicle Identification" />
				<QuestionRow
					question="What is your vehicle's plate number?"
					name="mmcode"
					value={getVal("mmcode")}
					error={getErr("mmcode")}
				>
					<InputField
						register={register}
						name="mmcode"
						placeholder="Plate Number"
						icon={Hash}
						required={true}
						errors={errors}
					/>
				</QuestionRow>
				<QuestionRow
					question="What is the make of your car?"
					name="make"
					value={getVal("make")}
					error={getErr("make")}
				>
					<InputField
						register={register}
						name="make"
						placeholder="Car Make"
						icon={FileType}
						required={true}
						errors={errors}
					/>
				</QuestionRow>
				<QuestionRow
					question="What year was your car manufactured?"
					name="year"
					value={getVal("year")}
					error={getErr("year")}
				>
					<InputField
						register={register}
						name="year"
						placeholder="Year"
						type="number"
						icon={Calendar}
						required={true}
						errors={errors}
						registerOptions={{
							valueAsNumber: true,
						}}
						min={1995}
						max={2026}
						inputMode="numeric"
						helperText="Enter a year between 1995 and 2026"
					/>
				</QuestionRow>
				<QuestionRow
					question="What is your car's model?"
					name="model"
					value={getVal("model")}
					error={getErr("model")}
				>
					<InputField
						register={register}
						name="model"
						placeholder="Model"
						icon={FileType}
						required={true}
						errors={errors}
						autoComplete="off"
					/>
				</QuestionRow>

				<SectionDivider text="Vehicle Details" />
				<QuestionRow
					question="Select your vehicle category"
					name="category"
					value={getVal("category")}
					error={getErr("category")}
				>
					<SelectField
						register={register}
						name="category"
						placeholder="Vehicle Category"
						options={categoryOptions}
						icon={Car}
						required={true}
						errors={errors}
					/>
				</QuestionRow>
				<QuestionRow
					question="What is the engine size (liters)?"
					name="engineSize"
					value={getVal("engineSize")}
					error={getErr("engineSize")}
				>
					<InputField
						register={register}
						name="engineSize"
						placeholder="e.g. 1.6"
						type="number"
						icon={Car}
						required={true}
						errors={errors}
						min={1}
						max={10}
						step={0.1}
						inputMode="decimal"
						helperText="Enter a value between 1 and 10 liters"
						registerOptions={{
							valueAsNumber: true,
						}}
					/>
				</QuestionRow>
				<QuestionRow
					question="What is the car's status?"
					name="status"
					value={getVal("status")}
					error={getErr("status")}
				>
					<SelectField
						register={register}
						name="status"
						placeholder="Car Status"
						options={statusOptions}
						icon={Car}
						required={true}
						errors={errors}
					/>
				</QuestionRow>
				<QuestionRow
					question="What is the colour of your car?"
					name="colour"
					value={getVal("colour")}
					error={getErr("colour")}
				>
					<SelectField
						register={register}
						name="colour"
						placeholder="Colour"
						options={colourOptions}
						icon={Palette}
						required={true}
						errors={errors}
					/>
				</QuestionRow>

				<SectionDivider text="Parking Details" />
				{/* Switch: Is night park address the same as home address? */}
				<div className="mb-4 flex items-center gap-3">
					<input
						type="checkbox"
						id="nightParkSameAsHome"
						checked={useHomeForNightPark}
						onChange={handleNightParkSwitch}
						className="w-4 h-4 border-gray-300 rounded text-teal-600 focus:ring-teal-500"
					/>
					<label
						htmlFor="nightParkSameAsHome"
						className="text-sm text-gray-700"
					>
						Is the night park address the same as your home address?
					</label>
				</div>
				<QuestionRow
					question="Where is your car parked at night? (Address line)"
					name="nightPark.addressLine"
					value={
						useHomeForNightPark
							? homeAddress.addressline
							: getVal("nightPark.addressLine")
					}
					error={getErr("nightPark")?.addressLine}
				>
					<InputField
						register={register}
						name="nightPark.addressLine"
						placeholder="Night Park Address Line"
						icon={Lock}
						required={true}
						errors={errors}
						defaultValue={
							useHomeForNightPark ? homeAddress.addressline : undefined
						}
						disabled={useHomeForNightPark}
					/>
				</QuestionRow>
				<QuestionRow
					question="Night park suburb"
					name="nightPark.suburb"
					value={
						useHomeForNightPark
							? homeAddress.suburb
							: getVal("nightPark.suburb")
					}
					error={getErr("nightPark")?.suburb}
				>
					<InputField
						register={register}
						name="nightPark.suburb"
						placeholder="Night Park Suburb"
						icon={Lock}
						required={true}
						errors={errors}
						defaultValue={useHomeForNightPark ? homeAddress.suburb : undefined}
						disabled={useHomeForNightPark}
					/>
				</QuestionRow>
				<QuestionRow
					question="Night park postal code"
					name="nightPark.postalCode"
					value={
						useHomeForNightPark
							? homeAddress.postalcode
							: getVal("nightPark.postalCode")
					}
					error={getErr("nightPark")?.postalCode}
				>
					<InputField
						register={register}
						name="nightPark.postalCode"
						placeholder="Night Park Postal Code"
						icon={Lock}
						required={true}
						errors={errors}
						inputMode="numeric"
						autoComplete="postal-code"
						defaultValue={
							useHomeForNightPark ? homeAddress.postalcode : undefined
						}
						disabled={useHomeForNightPark}
					/>
				</QuestionRow>

				<QuestionRow
					question="Where does your car sleep?"
					name="overnightParkingSituation"
					value={getVal("overnightParkingSituation")}
					error={getErr("overnightParkingSituation")}
				>
					<SelectField
						register={register}
						name="overnightParkingSituation"
						placeholder="Car Sleep"
						options={[
							{ value: "Garage", label: "Garage" },
							{ value: "Carport", label: "Carport" },
							{ value: "InTheOpen", label: "In The Open" },
							{ value: "Item 1", label: "Unconfirmed" },
						]}
						icon={Lock}
						required={true}
						errors={errors}
					/>
				</QuestionRow>
				<QuestionRow
					question="Type of night park"
					name="typeOfNightPark"
					value={getVal("typeOfNightPark")}
					error={getErr("typeOfNightPark")}
				>
					<SelectField
						register={register}
						name="typeOfNightPark"
						placeholder="Type Of Night Park"
						options={typeOfNightParkOptions}
						icon={Lock}
						required={true}
						errors={errors}
					/>
				</QuestionRow>
				<QuestionRow
					question="Is there access control?"
					name="accessControl"
					value={getVal("accessControl")}
					error={getErr("accessControl")}
				>
					<SelectField
						register={register}
						name="accessControl"
						placeholder="Access Control"
						options={[
							{ value: "true", label: "Yes" },
							{ value: "false", label: "No" },
						]}
						icon={Lock}
						required={true}
						errors={errors}
						registerOptions={{
							valueAsBoolean: true,
						}}
					/>
				</QuestionRow>
				<QuestionRow
					question="Is there a security guard?"
					name="securityGuard"
					value={getVal("securityGuard")}
					error={getErr("securityGuard")}
				>
					<SelectField
						register={register}
						name="securityGuard"
						placeholder="Security Guard"
						options={[
							{ value: "true", label: "Yes" },
							{ value: "false", label: "No" },
						]}
						icon={Shield}
						required={true}
						errors={errors}
						registerOptions={{
							valueAsBoolean: true,
						}}
					/>
				</QuestionRow>

				<SectionDivider text="Ownership" />
				<QuestionRow
					question="Are you the owner of the vehicle?"
					name="isOwner"
					value={isOwner}
					error={getErr("isOwner")}
				>
					<SelectField
						register={register}
						name="isOwner"
						placeholder="Are you the owner?"
						options={[
							{ value: true, label: "Yes" },
							{ value: false, label: "No" },
						]}
						icon={User}
						required={true}
						errors={errors}
						switchMode
						watch={watch}
						registerOptions={{
							valueAsBoolean: true,
						}}
					/>
				</QuestionRow>
				{isOwner === false && (
					<div className="mt-4">
						<SectionDivider text="Owner Details" />
						<QuestionRow
							question="Owner's First Name"
							name="ownerVehicleDetails.ownersFirstName"
							value={getVal("ownerVehicleDetails.ownersFirstName")}
							error={getErr("ownerVehicleDetails")?.ownersFirstName}
						>
							<InputField
								register={register}
								name="ownerVehicleDetails.ownersFirstName"
								placeholder="Owner's First Name"
								icon={User}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
						<QuestionRow
							question="Owner's Surname"
							name="ownerVehicleDetails.ownersLastName1"
							value={getVal("ownerVehicleDetails.ownersLastName1")}
							error={getErr("ownerVehicleDetails")?.ownersLastName1}
						>
							<InputField
								register={register}
								name="ownerVehicleDetails.ownersLastName1"
								placeholder="Owner's Surname"
								icon={User}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
						<QuestionRow
							question="Owner's Contact Number"
							name="ownerVehicleDetails.ownersContactNumber1"
							value={getVal("ownerVehicleDetails.ownersContactNumber1")}
							error={getErr("ownerVehicleDetails")?.ownersContactNumber1}
						>
							<InputField
								register={register}
								name="ownerVehicleDetails.ownersContactNumber1"
								placeholder="Owner's Contact Number"
								icon={Phone}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
						<QuestionRow
							question="Owner's ID Number"
							name="ownerVehicleDetails.ownersIdNumber"
							value={getVal("ownerVehicleDetails.ownersIdNumber")}
							error={getErr("ownerVehicleDetails")?.ownersIdNumber}
						>
							<InputField
								register={register}
								name="ownerVehicleDetails.ownersIdNumber"
								placeholder="Owner's ID Number"
								icon={CreditCard}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
						<QuestionRow
							question="Relation to Owner"
							name="ownerVehicleDetails.relationshipToOwner"
							value={getVal("ownerVehicleDetails.relationshipToOwner")}
							error={getErr("ownerVehicleDetails")?.relationshipToOwner}
						>
							<SelectField
								register={register}
								name="ownerVehicleDetails.relationshipToOwner"
								placeholder="Relation to Owner"
								options={[
									{ value: "self", label: "Self" },
									{ value: "spouse", label: "Spouse" },
									{ value: "other", label: "Other" },
								]}
								icon={User}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
					</div>
				)}
				{isOwner === true && (
					<div className="mt-4">
						<SectionDivider text="Owner Details (Prefilled)" />
						{/* Prefilled, read-only owner fields for owner = true */}
						<QuestionRow
							question="Owner's First Name"
							name="ownerVehicleDetails.ownersFirstName"
							value={policyFirstName}
							error={undefined}
						>
							<InputField
								register={register}
								name="ownerVehicleDetails.ownersFirstName"
								placeholder="Owner's First Name"
								icon={User}
								required={true}
								errors={{}}
								defaultValue={policyFirstName}
								disabled={true}
							/>
						</QuestionRow>
						<QuestionRow
							question="Owner's Surname"
							name="ownerVehicleDetails.ownersLastName1"
							value={policyLastName}
							error={undefined}
						>
							<InputField
								register={register}
								name="ownerVehicleDetails.ownersLastName1"
								placeholder="Owner's Surname"
								icon={User}
								required={true}
								errors={{}}
								defaultValue={policyLastName}
								disabled={true}
							/>
						</QuestionRow>
						<QuestionRow
							question="Owner's Contact Number"
							name="ownerVehicleDetails.ownersContactNumber1"
							value={policyContact}
							error={undefined}
						>
							<InputField
								register={register}
								name="ownerVehicleDetails.ownersContactNumber1"
								placeholder="Owner's Contact Number"
								icon={Phone}
								required={true}
								errors={{}}
								defaultValue={policyContact}
								disabled={true}
							/>
						</QuestionRow>
						<QuestionRow
							question="Owner's ID Number"
							name="ownerVehicleDetails.ownersIdNumber"
							value={policyId}
							error={undefined}
						>
							<InputField
								register={register}
								name="ownerVehicleDetails.ownersIdNumber"
								placeholder="Owner's ID Number"
								icon={CreditCard}
								required={true}
								errors={{}}
								defaultValue={policyId}
								disabled={true}
							/>
						</QuestionRow>
						<QuestionRow
							question="Relation to Owner"
							name="ownerVehicleDetails.relationshipToOwner"
							value="self"
							error={undefined}
						>
							<SelectField
								register={register}
								name="ownerVehicleDetails.relationshipToOwner"
								placeholder="Relation to Owner"
								options={[
									{ value: "self", label: "Self" },
									{ value: "spouse", label: "Spouse" },
									{ value: "other", label: "Other" },
								]}
								icon={User}
								required={true}
								errors={{}}
								defaultValue="self"
								disabled={true}
							/>
						</QuestionRow>
					</div>
				)}

				<SectionDivider text="Regular Driver" />
				<QuestionRow
					question="Are you the regular driver?"
					name="partyregularDriver"
					value={partyregularDriver}
					error={getErr("partyregularDriver")}
				>
					<SelectField
						register={register}
						name="partyregularDriver"
						placeholder="Are you the regular driver?"
						options={[
							{ value: true, label: "Yes" },
							{ value: false, label: "No" },
						]}
						icon={User}
						required={true}
						errors={errors}
						switchMode
						watch={watch}
						registerOptions={{
							valueAsBoolean: true,
						}}
					/>
				</QuestionRow>
				{partyregularDriver === false && (
					<div className="mt-4">
						<SectionDivider text="Regular Driver Details" />
						<QuestionRow
							question="Regular Driver First Name"
							name="regulardriverDetails.regularDriverFirstName"
							value={getVal("regulardriverDetails.regularDriverFirstName")}
							error={getErr("regulardriverDetails")?.regularDriverFirstName}
						>
							<InputField
								register={register}
								name="regulardriverDetails.regularDriverFirstName"
								placeholder="Regular Driver First Name"
								icon={User}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
						<QuestionRow
							question="Regular Driver Surname"
							name="regulardriverDetails.regularDriverLastName"
							value={getVal("regulardriverDetails.regularDriverLastName")}
							error={getErr("regulardriverDetails")?.regularDriverLastName}
						>
							<InputField
								register={register}
								name="regulardriverDetails.regularDriverLastName"
								placeholder="Regular Driver Surname"
								icon={User}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
						<QuestionRow
							question="Regular Driver Contact Number"
							name="regulardriverDetails.regularDriverContactNumber"
							value={getVal("regulardriverDetails.regularDriverContactNumber")}
							error={getErr("regulardriverDetails")?.regularDriverContactNumber}
						>
							<InputField
								register={register}
								name="regulardriverDetails.regularDriverContactNumber"
								placeholder="Regular Driver Contact Number"
								icon={Phone}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
						<QuestionRow
							question="Regular Driver ID Number"
							name="regulardriverDetails.regularDriverIdNumber"
							value={getVal("regulardriverDetails.regularDriverIdNumber")}
							error={getErr("regulardriverDetails")?.regularDriverIdNumber}
						>
							<InputField
								register={register}
								name="regulardriverDetails.regularDriverIdNumber"
								placeholder="Regular Driver ID Number"
								icon={CreditCard}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
						<QuestionRow
							question="Relation to Regular Driver"
							name="regulardriverDetails.relationToRegularDriver"
							value={getVal("regulardriverDetails.relationToRegularDriver")}
							error={getErr("regulardriverDetails")?.relationToRegularDriver}
						>
							<SelectField
								register={register}
								name="regulardriverDetails.relationToRegularDriver"
								placeholder="Relation to Regular Driver"
								options={[
									{ value: "self", label: "Self" },
									{ value: "spouse", label: "Spouse" },
									{ value: "other", label: "Other" },
								]}
								icon={User}
								required={true}
								errors={errors}
							/>
						</QuestionRow>
					</div>
				)}

				<SectionDivider text="Additional Details" />
				<QuestionRow
					question="Are you disabled?"
					name="isDisabled"
					value={isDisabled}
					error={getErr("isDisabled")}
				>
					<SelectField
						register={register}
						name="isDisabled"
						placeholder="Are you disabled?"
						options={[
							{ value: true, label: "Yes" },
							{ value: false, label: "No" },
						]}
						icon={User}
						required={true}
						errors={errors}
						switchMode
						watch={watch}
						registerOptions={{
							valueAsBoolean: true,
						}}
					/>
				</QuestionRow>
				{isDisabled === true && (
					<QuestionRow
						question="Describe your disability"
						name="disabledDisability"
						value={getVal("disabledDisability")}
						error={getErr("disabledDisability")}
					>
						<InputField
							register={register}
							name="disabledDisability"
							placeholder="Describe your disability"
							icon={User}
							required={true}
							errors={errors}
						/>
					</QuestionRow>
				)}
				<QuestionRow
					question="What is the vehicle used for?"
					name="usedFor"
					value={getVal("usedFor")}
					error={getErr("usedFor")}
				>
					<SelectField
						register={register}
						name="usedFor"
						placeholder="Used for?"
						options={usedForOptions}
						icon={Car}
						required={true}
						errors={errors}
					/>
				</QuestionRow>
				<QuestionRow
					question="Does the vehicle have accessories?"
					name="isAccessories"
					value={isAccessories}
					error={getErr("isAccessories")}
				>
					<SelectField
						register={register}
						name="isAccessories"
						placeholder="Accessories?"
						options={[
							{ value: true, label: "Yes" },
							{ value: false, label: "No" },
						]}
						icon={Car}
						required={true}
						errors={errors}
						switchMode
						watch={watch}
						registerOptions={{
							valueAsBoolean: true,
						}}
					/>
				</QuestionRow>
				{isAccessories === true && (
					<QuestionRow
						question="Accessories Amount"
						name="accessoriesAmount"
						value={getVal("accessoriesAmount")}
						error={getErr("accessoriesAmount")}
					>
						<InputField
							register={register}
							name="accessoriesAmount"
							placeholder="Accessories Amount"
							type="number"
							icon={Car}
							required={true}
							errors={errors}
						/>
					</QuestionRow>
				)}
				<QuestionRow
					question="Is the vehicle financed?"
					name="isFinanced"
					value={isFinanced}
					error={getErr("isFinanced")}
				>
					<SelectField
						register={register}
						name="isFinanced"
						placeholder="Is the vehicle financed?"
						options={[
							{ value: true, label: "Yes" },
							{ value: false, label: "No" },
						]}
						icon={Car}
						required={true}
						errors={errors}
						switchMode
						watch={watch}
						registerOptions={{
							valueAsBoolean: true,
						}}
					/>
				</QuestionRow>
				{isFinanced === true && (
					<QuestionRow
						question="Financial House"
						name="financedBy"
						value={getVal("financedBy")}
						error={getErr("financedBy")}
					>
						<InputField
							register={register}
							name="financedBy"
							placeholder="Financial House"
							icon={Car}
							required={true}
							errors={errors}
						/>
					</QuestionRow>
				)}
				<QuestionRow
					question="Does the vehicle have a tracking device?"
					name="trackingDevice"
					value={getVal("trackingDevice")}
					error={getErr("trackingDevice")}
				>
					<SelectField
						register={register}
						name="trackingDevice"
						placeholder="Tracking Device?"
						options={[
							{ value: true, label: "Yes" },
							{ value: false, label: "No" },
						]}
						icon={Car}
						required={true}
						errors={errors}
						switchMode
						watch={watch}
						registerOptions={{
							valueAsBoolean: true,
						}}
					/>
				</QuestionRow>
				<QuestionRow
					question="Insured Value Type"
					name="insuredValuetype"
					value={getVal("insuredValuetype")}
					error={getErr("insuredValuetype")}
				>
					<SelectField
						register={register}
						name="insuredValuetype"
						placeholder="Insured Value Type"
						options={[
							{ value: "Retail", label: "Retail" },
							{ value: "Market", label: "Market" },
						]}
						icon={Car}
						required={true}
						errors={errors}
					/>
				</QuestionRow>
				<QuestionRow
					question="Retail Value"
					name="retailValue"
					value={getVal("retailValue")}
					error={getErr("retailValue")}
				>
					<InputField
						register={register}
						name="retailValue"
						placeholder="Retail Value"
						type="number"
						icon={Car}
						required={true}
						errors={errors}
						registerOptions={{
							valueAsNumber: true,
						}}
					/>
				</QuestionRow>
				<QuestionRow
					question="Cover Code"
					name="coverCode"
					value={getVal("coverCode")}
					error={getErr("coverCode")}
				>
					<SelectField
						register={register}
						name="coverCode"
						placeholder="Cover Code"
						options={[{ value: "comprehensive", label: "Comprehensive" }]}
						icon={Car}
						required={true}
						errors={errors}
					/>
				</QuestionRow>
			</FormSection>
		</div>
	);
};

export default VehicleSection;
