import { logger } from "@utils/logger";

/**
 * Comprehensive error handling utility
 */
export const ErrorHandler = {
	/**
	 * Process API errors with consistent formatting
	 * @param {Error} error - The error object
	 * @returns {string} Formatted error message
	 */
	processApiError: (error) => {
		// Log the error for debugging
		logger.error("API Error:", error);

		// Check if it's an axios error with response
		if (error.response) {
			// Server responded with non-2xx code
			const { status, data } = error.response;

			// Handle specific HTTP status codes
			switch (status) {
				case 400:
					return (
						data.error ||
						"Invalid request data. Please check your information and try again."
					);
				case 401:
					return "Authentication required. Please log in and try again.";
				case 403:
					return "You don't have permission to perform this action.";
				case 404:
					return "The requested resource was not found.";
				case 413:
					return "The request data is too large. Please reduce the size of your submission.";
				case 429:
					return "Too many requests. Please try again in a few minutes.";
				case 500:
					return "Internal server error. Our team has been notified.";
				default:
					return (
						data.error || `Server error (${status}). Please try again later.`
					);
			}
		}

		// Network error (no response)
		if (error.request) {
			if (!navigator.onLine) {
				return "You appear to be offline. Please check your internet connection.";
			}
			if (error.code === "ECONNABORTED") {
				return "Request timed out. Please try again later.";
			}
			return "No response received from server. Please check your connection and try again.";
		}

		// Something happened in setting up the request
		return error.message || "An unexpected error occurred. Please try again.";
	},

	/**
	 * Handle form validation errors
	 * @param {Object} error - Zod or form validation error object
	 * @returns {string} User-friendly error message
	 */
	processFormError: (error) => {
		// Check if it's a Zod error
		if (error.errors && Array.isArray(error.errors)) {
			// Get the first error message for display
			const firstError = error.errors[0];
			return `${firstError.path.join(".")}: ${firstError.message}`;
		}

		// React Hook Form error
		if (error.type === "required") {
			return `${error.ref?.name || "Field"} is required`;
		}

		// Generic error message
		return error.message || "Please check your form for errors";
	},

	/**
	 * Validate critical security inputs to prevent injection attacks
	 * @param {string} input - User input to validate
	 * @param {string} type - Type of validation to perform
	 * @returns {boolean} Whether the input is valid
	 */
	validateSecurityInput: (input, type) => {
		if (!input) return false;

		switch (type) {
			case "email":
				return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input);

			case "phone":
				return /^(\+27|0)[6-8][0-9]{8}$/.test(input);

			case "idNumber":
				return /^\d{13}$/.test(input);

			case "name":
				return /^[A-Za-z\s\-']{2,50}$/.test(input);

			case "numeric":
				return /^\d+$/.test(input) && !isNaN(parseFloat(input));

			case "text":
				// Basic XSS check
				return !/[<>]/.test(input);

			default:
				return true;
		}
	},

	/**
	 * Log errors to monitoring service
	 * @param {Error} error - Error object
	 * @param {string} context - Context where the error occurred
	 */
	logErrorToMonitoring: (error, context = "general") => {
		// Log locally
		logger.error(`[${context}] Error:`, error);

		// In a real app, you would send this to a monitoring service like Sentry
		// Example: Sentry.captureException(error, { tags: { context } });

		// Add debug info
		const debugInfo = {
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			url: window.location.href,
			context,
		};

		logger.debug("Error debug info:", debugInfo);
	},
};
