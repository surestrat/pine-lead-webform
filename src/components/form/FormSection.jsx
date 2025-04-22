import { AnimatePresence, motion } from "framer-motion";

const FormSection = ({ children, isOpen }) => {
	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{
						opacity: 1,
						height: "auto",
						transition: {
							opacity: { duration: 0.2 },
							height: { duration: 0.3 },
						},
					}}
					exit={{
						opacity: 0,
						height: 0,
						transition: {
							opacity: { duration: 0.2 },
							height: { duration: 0.3 },
						},
					}}
					transition={{ duration: 0.3 }}
					className="overflow-hidden"
				>
					<div className="py-2 space-y-4">{children}</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default FormSection;
