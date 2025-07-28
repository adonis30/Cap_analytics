import mongoose from "mongoose";
import Grants, { IGrant } from "../database/models/grants.model";

/**
 * Fetch all grants from the database
 * @returns Array of grant documents
 */
export const getAllGrants = async (): Promise<IGrant[]> => {
  try {
    const grants = await Grants.find().sort({ expiredingDate: 1 }); // Optional: sort by expiration
    return grants;
  } catch (error) {
    console.error("Error fetching all grants:", error);
    throw new Error("Failed to retrieve grants");
  }
};

/**
 * Fetch a single grant by its ID
 * @param id - MongoDB ObjectId string
 * @returns Grant document or null
 */
export const getGrantById = async (id: string): Promise<IGrant | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid grant ID");
    }

    const grant = await Grants.findById(id);
    return grant;
  } catch (error) {
    console.error(`Error fetching grant with ID ${id}:`, error);
    throw new Error("Failed to retrieve grant");
  }
};
