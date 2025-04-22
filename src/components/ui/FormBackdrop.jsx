import { motion } from "framer-motion";

const FormBackdrop = ({ children }) => {
	return (
		<div className="relative min-h-screen w-full py-12 md:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50/30 overflow-hidden">
			{/* Background patterns - adds a modern tech feel */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f620_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
				<motion.div
					className="absolute -top-[20%] -right-[20%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-3xl"
					animate={{
						x: [0, 30, 0],
						y: [0, -30, 0],
						rotate: [0, 5, 0],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						repeatType: "reverse",
					}}
				/>
				<motion.div
					className="absolute -bottom-[20%] -left-[20%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl"
					animate={{
						x: [0, -30, 0],
						y: [0, 30, 0],
						rotate: [0, -5, 0],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						repeatType: "reverse",
						delay: 2,
					}}
				/>
			</div>

			{/* Content */}
			<div className="relative">{children}</div>
		</div>
	);
};

export default FormBackdrop;
