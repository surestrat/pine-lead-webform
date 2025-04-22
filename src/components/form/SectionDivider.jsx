import { motion } from "framer-motion";

const SectionDivider = ({ text }) => {
	return (
		<div className="relative flex items-center py-5">
			<div className="flex-grow border-t border-gray-200"></div>
			<motion.span
				className="flex-shrink mx-4 text-sm font-medium text-gray-500"
				initial={{ opacity: 0, y: 5 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				{text}
			</motion.span>
			<div className="flex-grow border-t border-gray-200"></div>
		</div>
	);
};

export default SectionDivider;
