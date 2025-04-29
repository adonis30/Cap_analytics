"use server"

import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import SDGFocus from '../database/models/sdgFocus.model';


inferface SDGFocusData {
    id: string;
    name: string;
    // Add more properties if needed
}

/**
 * Create a new SDG focus in the database.
 * @param {SDGFocusData} sdgFocusData - The data for the new SDG focus.
 * @returns {Promise<SDGFocusData>} - The created SDG focus.
 */
export const createSDGFocus = async (sdgFocusName: string): Promise<{
    _id: string; value: string; label: string}> => {
    try {
        await connectToDatabase();
        const newSDGFocus = await SDGFocus.create({ name: sdgFocusName });
        return {
            _id: newSDGFocus._id.toString(),
            value: newSDGFocus._id.toString(),
            label: newSDGFocus.name
        };
    } catch (error) {
        handleError(error);
        throw error; // Ensure to propagate the error
    }
}

/**
 * Get a SDG focus by its ID.
 * @param {string} sdgFocusId - The ID of the SDG focus.
 * @returns {Promise<SDGFocusData>} - The SDG focus.
 */
export const getSDGFocusById = async (sdgFocusId: string) => {
    try {
        await connectToDatabase();
        const sdgFocus = await SDGFocus.findById(sdgFocusId);
        if (!sdgFocus) {
            throw new Error('SDG focus not found');
        }
        return JSON.parse(JSON.stringify(sdgFocus));
    } catch (error) {
        handleError(error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

/**
 * Update a SDG focus by its ID.
 * @param {string} sdgFocusId - The ID of the SDG focus to update.
 * @param {Partial<SDGFocusData>} updates - The updates to apply.
 * @returns {Promise<SDGFocusData>} - The updated SDG focus.
 */
export const updateSDGFocus = async (sdgFocusId: string, updates: Partial<SDGFocusData>) => {
    try {
        await connectToDatabase();
        const updatedSDGFocus = await SDGFocus.findByIdAndUpdate(sdgFocusId, updates, { new: true });
        if (!updatedSDGFocus) {
            throw new Error('SDG focus not found');
        }
        return JSON.parse(JSON.stringify(updatedSDGFocus));
    } catch (error) {
        handleError(error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

/**
 * Delete a SDG focus by its ID.
 * @param {string} sdgFocusId - The ID of the SDG focus to delete.
 * @returns {Promise<void>} - A promise that resolves when the SDG focus is deleted.
 */
export const deleteSDGFocus = async (sdgFocusId: string) => {
    try {
        await connectToDatabase();
        const deletedSDGFocus = await SDGFocus.findByIdAndDelete(sdgFocusId);
        if (!deletedSDGFocus) {
            throw new Error('SDG focus not found');
        }
    } catch (error) {
        handleError(error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

/**
 * Get all SDG focuses from the database.
 * @returns {Promise<SDGFocusData[]>} - An array of all SDG focuses.
 */
export const getAllSDGFocuses = async (): Promise<SDGFocusData[]> => {
    try {
        await connectToDatabase();
        const sdgFocuses = await SDGFocus.find();
        return JSON.parse(JSON.stringify(sdgFocuses));
    } catch (error) {
        handleError(error);
        throw error; // Re-throw the error to be handled by the caller
    }
}
/**
 * Get all SDG focuses from the database.
 * @returns {Promise<SDGFocusData[]>} - An array of all SDG focuses.
 *  */
export const getAllSDGFocusesForSelect = async (): Promise<{ _id: string; value: string; label: string }[]> => {
    try {
        await connectToDatabase();
        const sdgFocuses = await SDGFocus.find();
        return sdgFocuses.map((sdgFocus) => ({
            _id: sdgFocus._id.toString(),
            value: sdgFocus._id.toString(),
            label: sdgFocus.name
        }));
    } catch (error) {
        handleError(error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

/**
 * Get all SDG focuses from the database.
 * @returns {Promise<SDGFocusData[]>} - An array of all SDG focuses.
 *  */
export const getAllSDGFocusesForSelectWithLabel = async (): Promise<{ _id: string; value: string; label: string }[]> => {
    try {
        await connectToDatabase();
        const sdgFocuses = await SDGFocus.find();
        return sdgFocuses.map((sdgFocus) => ({
            _id: sdgFocus._id.toString(),
            value: sdgFocus._id.toString(),
            label: sdgFocus.name
        }));
    } catch (error) {
        handleError(error);
        throw error; // Re-throw the error to be handled by the caller
    }
}