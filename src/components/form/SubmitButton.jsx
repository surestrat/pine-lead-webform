import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, Loader2, Send } from "lucide-react";
import { logger } from "@utils/logger";

const SubmitButton = ({
	isSubmitting,
	submitSuccess,
	text = "Get Your Free Quote",
	onClick,
}) => {
	logger.debug("🔘 Rendering SubmitButton component", {
		isSubmitting,
		submitSuccess,
	});

	const handleClick = (e) => {
		if (!isSubmitting) {
			logger.info("🖱️ Submit button clicked");
			if (onClick) onClick(e);
		} else {
			logger.debug(
				"🔄 Submit button clicked while already submitting - ignoring"
			);
		}
	};

	// Determine button text and disabled state based on form state
	const buttonText = isSubmitting
		? "Processing..."
		: submitSuccess
		? "Submitted Successfully!"
		: "Submit Quote Request";

	// Button is disabled during submission or briefly after success
	const isDisabled = isSubmitting || submitSuccess;

	return (
		<motion.button
			type="submit"
			disabled={isDisabled}
			className={`relative flex items-center justify-center px-6 py-3 text-white rounded-lg shadow-sm transition-all duration-300 ${
				submitSuccess
					? "bg-green-600 hover:bg-green-700"
					: "bg-teal-600 hover:bg-teal-700"
			} disabled:opacity-70 disabled:cursor-not-allowed`}
			whileHover={
				!isDisabled
					? { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }
					: {}
			}
			whileTap={!isDisabled ? { scale: 0.98 } : {}}
			transition={{ type: "spring", stiffness: 400, damping: 10 }}
			onClick={handleClick}
		>
			{isSubmitting ? (
				<Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
			) : submitSuccess ? (
				<CheckCircleIcon className="w-5 h-5 mr-2" aria-hidden="true" />
			) : (
				<Send className="w-4 h-4 mr-2" aria-hidden="true" />
			)}

			<span>{buttonText}</span>

			{/* Hidden element for screen readers during loading */}
			{isSubmitting && (
				<span className="sr-only">Processing your request. Please wait.</span>
			)}
		</motion.button>
	);
};

export default SubmitButton;
