import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

import { useState } from "react";
import { Briefcase } from "lucide-react"; // Assuming you are using lucide-react for icons, adjust import if needed

/**
 * @typedef {object} Item
 * @property {React.ReactNode} icon - React icon component
 * @property {string} title - Card title
 * @property {string} description - Card description
 * @property {string} image - Path to the card image
 * @property {string} color - Tailwind CSS gradient classes (e.g., "from-teal-500 to-teal-600")
 * @property {string} link - URL or path for the card link
 */

/**
 * @typedef {object} HoverEffectProps
 * @property {Item[]} items - Array of items to display in the hover effect grid
 * @property {string} [className] - Optional CSS class names to apply to the container
 */

/**
 * HoverEffect component to display a grid of interactive cards with hover animations.
 * @param {HoverEffectProps} props
 * @returns {React.ReactNode}
 */
export const HoverEffect = ({ items, className }) => {
	let [hoveredIndex, setHoveredIndex] = useState(null);

	return (
		<div
			className={cn(
				"grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  gap-8 mt-16",
				className
			)} // Added gap and mt-16 and removed py-10 to match your layout
		>
			{items.map(
				(
					product,
					index // Renamed item to product for consistency with your code
				) => (
					<motion.div // Replaced Link with motion.div as per your provided structure
						key={index} // Using index as key, consider using a unique ID if available in your data
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.1 }}
						whileHover={{ scale: 1.02 }}
						className="group relative bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/50 hover:shadow-lg transition-all duration-300 overflow-hidden" // Your card styling
					>
						{/* Image Container - Copied from your code */}
						<div className="relative h-48 overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/25 z-10" />
							<img
								src={product.image}
								alt={product.title}
								className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20" />
						</div>

						{/* Content Container - Copied and adapted from your code, removed Card, CardTitle, CardDescription */}
						<div className="relative p-6">
							<div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
							<div className="relative flex items-start gap-4">
								<div
									className={`p-3 rounded-xl bg-gradient-to-r ${product.color} text-white shadow-lg`}
								>
									{product.icon}
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">
										{product.title}
									</h3>
									<p className="mt-2 text-gray-600 text-sm leading-relaxed">
										{product.description}
									</p>
								</div>
							</div>
						</div>
						<a
							href={product?.link}
							className="absolute inset-0 z-10 group-hover:cursor-pointer"
						>
							{" "}
							{/* Added Link here to wrap the entire card, and added cursor style */}
							<span className="sr-only">View {product.title}</span>{" "}
							{/* Accessibility */}
						</a>
					</motion.div>
				)
			)}
		</div>
	);
};

// Card, CardTitle, CardDescription are no longer used directly in HoverEffect in this version.
// You can keep them if you plan to use them elsewhere or remove them if they are only for HoverEffect's previous version.

export const Card = ({
	// Keeping Card component definition for now, but not used in HoverEffect
	className,
	children,
}) => {
	return (
		<div
			className={cn(
				"rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
				className
			)}
		>
			<div className="relative z-50">
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
};
export const CardTitle = ({
	// Keeping CardTitle component definition for now, but not used in HoverEffect
	className,
	children,
}) => {
	return (
		<h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
			{children}
		</h4>
	);
};
export const CardDescription = ({
	// Keeping CardDescription component definition for now, but not used in HoverEffect
	className,
	children,
}) => {
	return (
		<p
			className={cn(
				"mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
				className
			)}
		>
			{children}
		</p>
	);
};
