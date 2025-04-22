import { ShieldCheck } from "lucide-react";

const TermsSection = ({ register, errors }) => {
	const handleTermsClick = () => {
		// Track terms acknowledgment
		try {
			if (typeof window !== "undefined" && window.localStorage) {
				window.localStorage.setItem("terms_viewed", new Date().toISOString());
			}
		} catch (err) {
			// Silently fail if localStorage is not available
			console.warn("Failed to save terms acknowledgment", err);
		}
	};

	return (
		<div className="p-4 mt-6 space-y-3 bg-teal-50 rounded-lg">
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 p-1 bg-teal-100 rounded-full">
					<ShieldCheck className="w-5 h-5 text-blue-600" />
				</div>
				<div>
					<h3 className="text-sm font-medium text-gray-900">
						Data Protection & Privacy
					</h3>
					<p className="mt-1 text-xs leading-relaxed text-gray-600">
						We take your privacy seriously. Your data is encrypted and secured.
						We collect only the information necessary to provide accurate quotes
						and process your insurance applications.
					</p>
				</div>
			</div>

			<div className="flex items-start space-x-2">
				<div className="flex items-center h-5">
					<input
						id="termsAccepted"
						type="checkbox"
						className="w-4 h-4 border-gray-300 rounded text-teal-600 focus:ring-teal-500"
						{...register("termsAccepted", {
							required: "You must agree to the terms and conditions",
						})}
						aria-invalid={errors.termsAccepted ? "true" : "false"}
						onClick={handleTermsClick}
					/>
				</div>
				<div className="text-sm">
					<label
						htmlFor="termsAccepted"
						className={`font-medium ${
							errors.termsAccepted ? "text-red-700" : "text-gray-700"
						}`}
					>
						I agree to the terms and conditions
					</label>
					<p className="text-gray-500">
						By submitting this form, you agree to our{" "}
						<a
							href="/privacy-policy"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-teal-600 underline underline-offset-2 hover:text-teal-800"
						>
							privacy policy
						</a>{" "}
						and{" "}
						<a
							href="/terms-of-service"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-teal-600 underline underline-offset-2 hover:text-teal-800"
						>
							terms of service
						</a>
						.
					</p>
					{errors.termsAccepted && (
						<p className="mt-1 text-sm text-red-600" role="alert">
							{errors.termsAccepted.message}
						</p>
					)}
				</div>
			</div>

			{/* Display any root server errors */}
			{errors.root?.serverError && (
				<div
					className="p-3 mt-2 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md"
					role="alert"
				>
					{errors.root.serverError.message}
				</div>
			)}
		</div>
	);
};

export default TermsSection;
