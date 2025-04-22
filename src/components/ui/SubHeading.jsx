import { motion } from "framer-motion";
const SubHeading = ({ text }) => {
	return (
		<motion.p
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: 0.2 }}
			className="max-w-2xl mx-auto mt-6 text-lg text-gray-600"
		>
			{text}
		</motion.p>
	);
};

export default SubHeading;
