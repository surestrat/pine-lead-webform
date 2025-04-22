import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// InputField using shadcn Input
export const InputField = ({
	register,
	name,
	placeholder,
	type = "text",
	required = false,
	validation = {},
	errors = {},
	icon: Icon = null,
	className = "",
	registerOptions = {},
	autoComplete = "off",
	disabled = false,
	min,
	max,
	step,
	inputMode,
	helperText,
	defaultValue,
}) => {
	const hasError = !!errors?.[name];
	const [showPassword, setShowPassword] = useState(false);

	const actualType =
		type === "password" ? (showPassword ? "text" : "password") : type;

	const mergedRegisterOptions = {
		required: required && `${placeholder} is required`,
		...validation,
		...registerOptions,
	};

	return (
		<div className={`space-y-1 ${className}`}>
			<div className="relative">
				{Icon && (
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
						<Icon size={18} />
					</div>
				)}
				<Input
					{...register(name, mergedRegisterOptions)}
					id={name}
					placeholder={`${placeholder}${required ? " *" : ""}`}
					type={actualType}
					className={`w-full ${Icon ? "pl-10" : ""} ${
						hasError ? "border-red-500" : ""
					}`}
					aria-invalid={hasError ? "true" : "false"}
					autoComplete={autoComplete}
					disabled={disabled}
					min={min}
					max={max}
					step={step}
					inputMode={inputMode}
					defaultValue={defaultValue}
					aria-describedby={helperText ? `${name}-helper` : undefined}
				/>
				{type === "password" && (
					<button
						type="button"
						className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
						onClick={() => setShowPassword(!showPassword)}
						tabIndex={-1}
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				)}
			</div>
			{helperText && !hasError && (
				<p className="text-xs text-gray-500" id={`${name}-helper`}>
					{helperText}
				</p>
			)}
			{hasError && errors[name]?.message && (
				<p className="text-sm text-red-600" role="alert">
					{errors[name].message}
				</p>
			)}
		</div>
	);
};

// SelectField using shadcn Select and Switch
export const SelectField = ({
	register,
	name,
	placeholder,
	options,
	required = false,
	errors = {},
	icon: Icon = null,
	className = "",
	switchMode = false,
	watch,
	disabled = false,
	helperText,
	defaultValue = "",
	registerOptions = {}, // <-- add this line
}) => {
	const hasError = !!errors?.[name];

	if (switchMode) {
		const checked =
			typeof watch === "function"
				? (() => {
						const val = watch(name);
						return val === true || val === "true";
				  })()
				: undefined;

		return (
			<div className={`flex items-center gap-3 ${className}`}>
				{Icon && (
					<div className="text-gray-400">
						<Icon size={18} />
					</div>
				)}
				<label
					className="flex items-center cursor-pointer select-none gap-2"
					htmlFor={name}
				>
					<Switch
						checked={checked}
						onCheckedChange={(value) => {
							if (
								typeof register(name, registerOptions).onChange === "function"
							) {
								register(name, registerOptions).onChange({
									target: { name, value },
									type: "change",
								});
							}
						}}
						id={name}
						disabled={disabled}
					/>
					<span className="text-gray-700">{placeholder}</span>
				</label>
				{helperText && !hasError && (
					<p className="text-xs text-gray-500" id={`${name}-helper`}>
						{helperText}
					</p>
				)}
				{hasError && errors[name]?.message && (
					<p className="text-sm text-red-600 ml-2" role="alert">
						{errors[name].message}
					</p>
				)}
			</div>
		);
	}

	return (
		<div className={`space-y-1 ${className}`}>
			{Icon && (
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
					<Icon size={18} />
				</div>
			)}
			<Select
				onValueChange={(value) => {
					if (typeof register(name, registerOptions).onChange === "function") {
						register(name, registerOptions).onChange({
							target: { name, value },
							type: "change",
						});
					}
				}}
				defaultValue={defaultValue}
				disabled={disabled}
			>
				<SelectTrigger
					className={`w-full ${Icon ? "pl-10" : ""} ${
						hasError ? "border-red-500" : ""
					}`}
					id={name}
					aria-invalid={hasError ? "true" : "false"}
					aria-describedby={helperText ? `${name}-helper` : undefined}
				>
					<SelectValue placeholder={placeholder + (required ? " *" : "")} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{helperText && !hasError && (
				<p className="text-xs text-gray-500" id={`${name}-helper`}>
					{helperText}
				</p>
			)}
			{hasError && errors[name]?.message && (
				<p className="text-sm text-red-600" role="alert">
					{errors[name].message}
				</p>
			)}
		</div>
	);
};

export const CheckboxField = ({
	register,
	name,
	label,
	icon: Icon,
	value,
	required = false,
	errors = {},
	disabled = false,
	helperText,
	defaultChecked,
}) => {
	const fieldError = errors?.[name];

	return (
		<label className="flex items-center gap-2" htmlFor={name}>
			<Checkbox
				{...register(name, { required: required && "This field is required" })}
				value={value}
				id={name}
				disabled={disabled}
				defaultChecked={defaultChecked}
			/>
			{Icon && <Icon className="w-4 h-4 text-teal-600" />}
			<span className="font-medium">{label}</span>
			{helperText && !fieldError && (
				<p className="text-xs text-gray-500" id={`${name}-helper`}>
					{helperText}
				</p>
			)}
			{fieldError?.message && (
				<p className="text-sm text-red-600 ml-2" role="alert">
					{fieldError.message}
				</p>
			)}
		</label>
	);
};

export const RadioField = ({
	register,
	name,
	options,
	required = false,
	errors = {},
	inline = false,
	disabled = false,
	helperText,
	defaultValue,
}) => {
	const hasError = !!errors?.[name];

	return (
		<div className="space-y-1">
			<RadioGroup
				onValueChange={(value) => {
					if (typeof register(name).onChange === "function") {
						register(name).onChange({
							target: { name, value },
							type: "change",
						});
					}
				}}
				className={inline ? "flex flex-row gap-4" : "flex flex-col gap-2"}
				defaultValue={defaultValue}
				aria-invalid={hasError ? "true" : "false"}
				aria-describedby={helperText ? `${name}-helper` : undefined}
			>
				{options.map((option) => (
					<label
						key={option.value}
						htmlFor={`${name}-${option.value}`}
						className="flex items-center gap-2"
					>
						<RadioGroupItem
							value={option.value}
							id={`${name}-${option.value}`}
							disabled={disabled}
							{...register(name, {
								required: required && "This field is required",
							})}
						/>
						{option.label}
					</label>
				))}
			</RadioGroup>
			{helperText && !hasError && (
				<p className="text-xs text-gray-500" id={`${name}-helper`}>
					{helperText}
				</p>
			)}
			{hasError && errors[name]?.message && (
				<p className="text-sm text-red-600" role="alert">
					{errors[name].message}
				</p>
			)}
		</div>
	);
};
