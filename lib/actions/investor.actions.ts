'use server'

import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import Investor from '../database/models/investor.model';

interface InvestorData {
  name: string;
  email: string;
  phoneNumber: string;
  fundedCompaniesIds: string[];
  fundedRounds: string[];
  fundingTypes: string[];
  totalAmountFunded: number;
  highestAmountFunded: number;
}

export const createInvestor = async (investorData: InvestorData) => {
  try {
    await connectToDatabase();

    const newInvestor = await Investor.create(investorData);

    return JSON.parse(JSON.stringify(newInvestor));
  } catch (error) {
    handleError(error);
  }
};

export const getInvestorById = async (investorId: string) => {
  try {
    await connectToDatabase();

    const investor = await Investor.findById(investorId);

    if (!investor) {
      throw new Error('Investor not found');
    }

    return JSON.parse(JSON.stringify(investor));
  } catch (error) {
    handleError(error);
  }
};

export const getAllInvestors = async () => {
    try {
      await connectToDatabase();
      const investors = await Investor.find(); // Adjust this query based on your schema and needs
      return JSON.parse(JSON.stringify(investors));
    } catch (error) {
      handleError(error);
      throw error; // Ensure to propagate the error for proper error handling
    }
  };

export const updateInvestor = async (investorId: string, updates: Partial<InvestorData>) => {
  try {
    await connectToDatabase();

    const updatedInvestor = await Investor.findByIdAndUpdate(investorId, updates, { new: true });

    if (!updatedInvestor) {
      throw new Error('Investor not found');
    }

    return JSON.parse(JSON.stringify(updatedInvestor));
  } catch (error) {
    handleError(error);
  }
};

export const deleteInvestor = async (investorId: string) => {
  try {
    await connectToDatabase();

    const deletedInvestor = await Investor.findByIdAndDelete(investorId);

    if (!deletedInvestor) {
      throw new Error('Investor not found');
    }

    return true; // or return some meaningful success response
  } catch (error) {
    handleError(error);
  }
};
