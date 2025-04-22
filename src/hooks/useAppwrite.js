import { useState, useEffect } from "react";
import { logger } from "@utils/logger";
import db from "../appwrite/databases";
import client from "../appwrite/config";

/**
 * Custom hook for Appwrite services
 * @returns {Object} Appwrite utilities and state
 */
export const useAppwrite = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);

	/**
	 * Generic function to handle asynchronous Appwrite operations
	 * @param {Function} operation - The async operation to perform
	 * @param {string} operationName - Name of operation for logging
	 * @returns {Promise<any>} The result of the operation
	 */
	const handleOperation = async (operation, operationName) => {
		setIsLoading(true);
		setError(null);

		try {
			logger.debug(`Starting Appwrite operation: ${operationName}`);
			const result = await operation();
			logger.debug(`Completed Appwrite operation: ${operationName}`, result);
			return result;
		} catch (error) {
			logger.error(`Failed Appwrite operation: ${operationName}`, error);
			setError(error.message || "An unknown error occurred");
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Utility to fetch all quotes from the database
	 * @param {Array} queries - Query parameters
	 * @returns {Promise<Array>} List of quotes
	 */
	const getQuotes = (queries = []) => {
		return handleOperation(() => db.quotes.list(queries), "Get quotes list");
	};

	/**
	 * Get a single quote by ID with all related details
	 * @param {string} id - Quote ID
	 * @returns {Promise<Object>} Complete quote with details
	 */
	const getQuoteWithDetails = async (id) => {
		return handleOperation(async () => {
			// Get the base quote
			const quote = await db.quotes.get(id);

			// Get personal details
			const personalDetails = await db.personalDetails.list([`quote_id=${id}`]);

			// Get insurance types
			const insuranceTypes = await db.insuranceTypes.list([`quote_id=${id}`]);

			// Get other details based on insurance types
			const insuranceTypeValues = insuranceTypes.documents.map(
				(doc) => doc.insurance_type
			);

			// Object to store all related details
			const details = {};

			// Get vehicle details if applicable
			if (insuranceTypeValues.includes("vehicle")) {
				const vehicleDetails = await db.vehicleDetails.list([`quote_id=${id}`]);
				details.vehicle = vehicleDetails.documents[0] || null;
			}

			// Get property details if applicable
			if (insuranceTypeValues.includes("home")) {
				const propertyDetails = await db.propertyDetails.list([
					`quote_id=${id}`,
				]);
				details.property = propertyDetails.documents[0] || null;
			}

			// Get life insurance details if applicable
			if (insuranceTypeValues.includes("life")) {
				const lifeDetails = await db.lifeInsuranceDetails.list([
					`quote_id=${id}`,
				]);
				details.life = lifeDetails.documents[0] || null;
			}

			// Get business details if applicable
			if (insuranceTypeValues.includes("business")) {
				const businessDetails = await db.businessDetails.list([
					`quote_id=${id}`,
				]);
				details.business = businessDetails.documents[0] || null;
			}

			// Get terms agreement
			const termsAgreement = await db.termsAgreement.list([`quote_id=${id}`]);

			// Combine all data
			return {
				...quote,
				personalDetails: personalDetails.documents[0] || null,
				insuranceTypes: insuranceTypeValues,
				details,
				termsAgreement: termsAgreement.documents[0] || null,
			};
		}, `Get quote with details: ${id}`);
	};

	return {
		isLoading,
		error,
		client,
		database: db,
		getQuotes,
		getQuoteWithDetails,
		currentUser,
	};
};

export default useAppwrite;
