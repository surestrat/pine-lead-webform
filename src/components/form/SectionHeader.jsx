import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const SectionHeader = ({
	title,
	section,
	isOpen,
	icon: Icon,
	toggleSection,
}) => {
	const isToggleable = typeof toggleSection === "function";

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className={`flex items-center justify-between py-2 ${
				isToggleable ? "cursor-pointer" : ""
			}`}
			onClick={() => isToggleable && toggleSection(section)}
		>
			<div className="flex items-center">
				{Icon && (
					<span className="flex items-center justify-center w-8 h-8 mr-3 text-white rounded-lg bg-gradient-to-br from-teal-600 to-teal-500">
						<Icon size={18} />
					</span>
				)}
				<h3 className="text-lg font-medium text-gray-800">{title}</h3>
			</div>
			{isToggleable && (
				<motion.div
					initial={false}
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.3 }}
				>
					{isOpen ? (
						<ChevronUp className="text-gray-500" size={20} />
					) : (
						<ChevronDown className="text-gray-500" size={20} />
					)}
				</motion.div>
			)}
		</motion.div>
	);
};

export default SectionHeader;
