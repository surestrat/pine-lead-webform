import React from "react";
import { CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const SuccessAlert = ({ message, reference }) => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ type: "spring", bounce: 0.4 }}
			className="p-6 rounded-lg bg-green-50 border border-green-100 text-center"
		>
			<div className="flex justify-center mb-4">
				<div className="relative">
					<div className="absolute -inset-1 rounded-full bg-green-200/30 animate-ping" />
					<div className="relative p-2 bg-green-100 rounded-full">
						<CheckCircle className="w-8 h-8 text-green-600" />
					</div>
				</div>
			</div>

			<h3 className="text-xl font-medium text-green-800 mb-2 flex items-center justify-center gap-2">
				Success!
				<Sparkles className="w-5 h-5" />
			</h3>

			<p className="text-green-700 mb-4">
				{message || "Your quote request has been submitted successfully!"}
			</p>

			{reference && (
				<div className="bg-white p-3 rounded-md border border-green-200 inline-block">
					<p className="text-sm text-gray-500 mb-1">Reference Number:</p>
					<p className="font-mono font-medium text-green-600">{reference}</p>
				</div>
			)}

			<p className="mt-4 text-sm text-green-600">
				Our team will be in touch with you shortly.
			</p>
		</motion.div>
	);
};

export default SuccessAlert;
