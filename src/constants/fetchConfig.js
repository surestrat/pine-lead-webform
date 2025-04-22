/**
 * Default fetch configuration with proper headers
 */
export const defaultFetchConfig = {
	headers: {
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest",
		Accept: "application/json",
	},
};

/**
 * Create fetch POST configuration with data
 * @param {Object} data - Data to be sent in request body
 * @returns {Object} Fetch configuration object
 */
export const createPostConfig = (data) => ({
	...defaultFetchConfig,
	method: "POST",
	body: JSON.stringify(data),
});
