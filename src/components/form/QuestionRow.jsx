import { CheckCircle, Circle } from "lucide-react";

function CompletionIcon({ value, error }) {
	// Show check if value is boolean (true or false), or any non-empty value
	if (error) return <Circle className="text-gray-300 w-5 h-5 mr-2" />;
	if (
		typeof value === "boolean" ||
		(value !== undefined && value !== "" && value !== null)
	) {
		return <CheckCircle className="text-green-500 w-5 h-5 mr-2" />;
	}
	return <Circle className="text-gray-300 w-5 h-5 mr-2" />;
}

function QuestionRow({ question, name, value, error, children }) {
	return (
		<div className="mb-4">
			<div className="flex items-center mb-1">
				<CompletionIcon value={value} error={error} />
				<span
					className={`font-medium ${error ? "text-red-600" : "text-gray-800"}`}
				>
					{question}
				</span>
			</div>
			{children}
		</div>
	);
}
export default QuestionRow;
