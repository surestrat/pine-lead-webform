const PillHeader = ({ name }) => {
	return (
		<span className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 rounded-full px-4 py-1.5 text-sm font-medium">
			<span className="relative flex w-2 h-2">
				<span className="absolute inline-flex w-full h-full bg-teal-300 rounded-full opacity-75 animate-ping"></span>
				<span className="relative inline-flex w-2 h-2 bg-teal-400 rounded-full"></span>
			</span>
			{name}
		</span>
	);
};

export default PillHeader;
