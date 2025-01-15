"use server"
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import FundingType from '../database/models/fundingType.model';

interface FundingTypeData {
  id: string;
  name: string;
  // Add more properties if needed
}

/**
 * Create a new funding type in the database.
 * @param {FundingTypeData} fundingTypeData - The data for the new funding type.
 * @returns {Promise<FundingTypeData>} - The created funding type.
 */
export const createFundingType = async (fundingTypeName: string): Promise<{
  _id: string; value: string; label: string 
}> => {
  try {
    await connectToDatabase();
    const newFundingType = await FundingType.create({ name: fundingTypeName });
    return { 
      _id: newFundingType._id.toString(),
      value: newFundingType._id.toString(), 
      label: newFundingType.name 
    };
  } catch (error) {
    handleError(error);
    throw error; // Ensure to propagate the error
  }
};

/**
 * Get a funding type by its ID.
 * @param {string} fundingTypeId - The ID of the funding type.
 * @returns {Promise<FundingTypeData>} - The funding type.
 */
export const getFundingTypeById = async (fundingTypeId: string) => {
  try {
    await connectToDatabase();
    const fundingType = await FundingType.findById(fundingTypeId);
    if (!fundingType) {
      throw new Error('Funding type not found');
    }
    return JSON.parse(JSON.stringify(fundingType));
  } catch (error) {
    handleError(error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Update a funding type by its ID.
 * @param {string} fundingTypeId - The ID of the funding type to update.
 * @param {Partial<FundingTypeData>} updates - The updates to apply.
 * @returns {Promise<FundingTypeData>} - The updated funding type.
 */
export const updateFundingType = async (fundingTypeId: string, updates: Partial<FundingTypeData>) => {
  try {
    await connectToDatabase();
    const updatedFundingType = await FundingType.findByIdAndUpdate(fundingTypeId, updates, { new: true });
    if (!updatedFundingType) {
      throw new Error('Funding type not found');
    }
    return JSON.parse(JSON.stringify(updatedFundingType));
  } catch (error) {
    handleError(error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Get all funding types from the database.
 * @returns {Promise<FundingTypeData[]>} - An array of all funding types.
 */
export const getAllFundingTypes = async () => {
  try {
    await connectToDatabase();
    const fundingTypes = await FundingType.find(); // Adjust query if needed
    return JSON.parse(JSON.stringify(fundingTypes));
  } catch (error) {
    handleError(error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Delete a funding type by its ID.
 * @param {string} fundingTypeId - The ID of the funding type to delete.
 * @returns {Promise<boolean>} - True if deletion was successful.
 */
export const deleteFundingType = async (fundingTypeId: string) => {
  try {
    await connectToDatabase();
    const deletedFundingType = await FundingType.findByIdAndDelete(fundingTypeId);
    if (!deletedFundingType) {
      throw new Error('Funding type not found');
    }
    return true;
  } catch (error) {
    handleError(error);
    throw error; // Re-throw the error to be handled by the caller
  }
};