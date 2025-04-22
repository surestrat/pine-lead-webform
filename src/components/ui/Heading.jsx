const Heading = ({ whiteText, blueText }) => {
	return (
		<h2 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
			{whiteText}{" "}
			<span className="relative inline-block">
				<span className="relative z-10 text-transparent bg-gradient-to-r from-teal-400 to-teal-800 bg-clip-text">
					{blueText}
				</span>
				<svg
					className="absolute left-0 w-full -bottom-2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 800 200"
					fill="none"
					preserveAspectRatio="none"
					style={{ height: "12px" }}
				>
					<path
						d="M 0 100 Q 400 150 800 100 L 800 200 L 0 200 Z"
						fill="#dbeafe"
					/>
				</svg>
			</span>
		</h2>
	);
};

export default Heading;
