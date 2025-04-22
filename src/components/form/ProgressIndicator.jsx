import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const ProgressIndicator = ({ steps, currentStep, setCurrentStep }) => {
	return (
		<div className="relative">
			{/* Progress Bar */}
			<div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 bg-gray-200"></div>

			{/* Active Progress */}
			<motion.div
				className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-teal-500 origin-left"
				initial={{ scaleX: 0 }}
				animate={{
					scaleX: currentStep / (steps.length - 1),
				}}
				transition={{ duration: 0.4 }}
			></motion.div>

			{/* Step Indicators */}
			<div className="relative flex justify-between">
				{steps.map((step, index) => {
					const isCompleted = currentStep > index;
					const isActive = currentStep === index;

					return (
						<div key={step.id} className="flex flex-col items-center relative">
							<motion.button
								onClick={() => {
									// Only allow navigation to completed steps or next step
									if (index <= currentStep + 1 && index > 0) {
										setCurrentStep(index);
									}
								}}
								className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${
										isCompleted
											? "bg-teal-500 text-white"
											: isActive
											? "bg-white border-2 border-teal-500 text-teal-500"
											: "bg-white border border-gray-300 text-gray-400"
									}
                  ${
										index <= currentStep + 1
											? "cursor-pointer"
											: "cursor-not-allowed"
									}
                  transition-all duration-200 z-10 shadow-sm
                `}
								disabled={index > currentStep + 1}
								initial={{ scale: 0.8 }}
								animate={{
									scale: isActive ? 1.1 : 1,
									transition: { duration: 0.2 },
								}}
							>
								{isCompleted ? (
									<CheckCircle className="w-5 h-5" />
								) : (
									<span className="text-xs font-medium">{index + 1}</span>
								)}
							</motion.button>

							<div className="mt-2 text-xs text-center max-w-[80px] mx-auto">
								<p
									className={`font-medium ${
										isActive || isCompleted ? "text-teal-600" : "text-gray-500"
									}`}
								>
									{step.title.split(" ")[0]}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ProgressIndicator;
