import React from "react";
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ErrorReporter = ({ error, onDismiss }) => {
	if (!error) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6"
				role="alert"
			>
				<div className="flex items-start">
					<div className="flex-shrink-0">
						<AlertCircle className="w-5 h-5 text-red-500" />
					</div>

					<div className="ml-3 flex-1">
						<h3 className="text-sm font-medium text-red-800">
							There was an error with your submission
						</h3>
						<div className="mt-2 text-sm text-red-700">{error}</div>
					</div>

					{onDismiss && (
						<button
							onClick={onDismiss}
							className="flex-shrink-0 ml-2 bg-red-50 p-1 rounded-full hover:bg-red-100"
						>
							<X className="w-4 h-4 text-red-500" />
							<span className="sr-only">Dismiss</span>
						</button>
					)}
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default ErrorReporter;
