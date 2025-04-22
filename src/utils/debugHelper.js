/**
 * Debug helper for API communication
 */
export const testApiConnection = async () => {
	try {
		// Try to call the test API endpoint
		const response = await fetch("/api/test-api.php");
		const text = await response.text();

		console.log("API Test Response Text:", text);

		try {
			const data = JSON.parse(text);
			console.log("API Test Response Parsed:", data);
			return {
				success: true,
				data,
			};
		} catch (e) {
			console.error("Failed to parse API response:", e);
			return {
				success: false,
				error: "Failed to parse response as JSON",
				rawResponse: text,
			};
		}
	} catch (error) {
		console.error("API Test Error:", error);
		return {
			success: false,
			error: error.message,
		};
	}
};

/**
 * Call this function in browser console to test API:
 * debugApi.testApiConnection().then(console.log)
 */
window.debugApi = { testApiConnection };
