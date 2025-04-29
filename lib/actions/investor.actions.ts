'use server'

import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import Investor from '../database/models/investorBeseline.model';
import Company from '../database/models/company.model'; // Assuming you have a Company model
import User from '../database/models/user.model';
import IndividualInvestor from '../database/models/individualInvestor.model';
import InstitutionInvestor from '../database/models/institutionInvestor.model';
import { GetAllInvestorsParams, GetRelatedInvestorsByCategoryParams } from '@/types';
import FundingType from '../database/models/fundingType.model';
import FundingInstruments from '../database/models/fundingInstruments.model';
import FundingRounds from '../database/models/fundingRounds.model';
import Category from '../database/models/category.model';

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

const populateInvestors = async (query: any) => {
  return query
    .populate({ path: 'companyCreator', model: User, select: '_id firstName lastName' })
    .populate({ path: 'categories', model: Category, select: '_id name' })
    .populate({ path: 'fundingTypes', model: FundingType, select: '_id name' })
    .populate({ path: 'fundingInstruments', model: FundingInstruments, select: '_id name'})
    .populate({ path: 'fundingRounds', model: FundingRounds, select: '_id name'});
};

export async function getRelatedInvestorsByCategory({
  categoryId,
  investorId,
  limit = 3,
  page = 1,
}: GetRelatedInvestorsByCategoryParams) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const currentInvestor = await Investor.findById(investorId).select('categories');

    const conditions = { 
      categories: { $in: currentInvestor.categories }, 
      _id: { $ne: investorId } 
    };

    const investorsQuery = Investor.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const investors = await populateInvestors(investorsQuery);
    const investorCount = await Investor.countDocuments(conditions);

    return { 
      data: JSON.parse(JSON.stringify(investors)), 
      totalPages: Math.ceil(investorCount / limit) 
    };
  } catch (error) {
    handleError(error);
  }
}

export async function fetchCompanies() {
  try {
    await connectToDatabase();
    
    const companies = await Company.find({}, 'name organizationName _id'); 

    return companies.map(company => ({
      value: company._id.toString(),
      label: company.organizationName || company.name,
    }));
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function createInvestor(investorData: any) {
  try {
    await connectToDatabase();

    if (investorData.type === 'Individual') {
      delete investorData.institutionDetails;
    } else if (investorData.type === 'Institution') {
      delete investorData.individualDetails;
    }

    let newInvestor;
    if (investorData.type === 'Individual') {
      newInvestor = await IndividualInvestor.create(investorData);
    } else {
      newInvestor = await InstitutionInvestor.create(investorData);
    }

    return newInvestor;
  } catch (error) {
    console.error("Error creating investor:", error);
    throw error;
  }
}

export const getInvestorById = async (investorId: string) => {
  try {
    await connectToDatabase();

    // First, try to find the investor in IndividualInvestor
    const individualInvestor = await Investor.findById(investorId)
       .populate('fundingTypes', 'name')
  .populate('fundingRounds', 'name') // <- ADD
  .populate('fundingInstruments', 'name') // <- ADD
  .lean();

    if (individualInvestor) {
      return JSON.parse(JSON.stringify(individualInvestor));
    }

    // If not found, try to find the investor in InstitutionInvestor
    const institutionInvestor = await InstitutionInvestor.findById(investorId)
       .populate('fundingTypes', 'name')
  .populate('fundingRounds', 'name') // <- ADD
  .populate('fundingInstruments', 'name') // <- ADD
  .lean();

    if (institutionInvestor) {
      return JSON.parse(JSON.stringify(institutionInvestor));
    }

    // If not found in either model, throw an error
    throw new Error('Investor not found');
  } catch (error) {
    handleError(error);
  }
};

export const getAllInvestors = async (params: GetAllInvestorsParams) => {
  try {
    await connectToDatabase();

    const individualInvestors = await Investor.find()
      .sort({ _id: 'desc' })
  .skip((params.page - 1) * params.limit)
  .limit(params.limit)
  .populate('fundingTypes', 'name')
  .populate('fundingRounds', 'name') // <- ADD THIS
  .populate('fundingInstruments', 'name') // <- AND THIS
  .lean();

    const institutionInvestors = await InstitutionInvestor.find()
      .sort({ _id: 'desc' })
  .skip((params.page - 1) * params.limit)
  .limit(params.limit)
  .populate('fundingTypes', 'name')
  .populate('fundingRounds', 'name') // <- ADD THIS
  .populate('fundingInstruments', 'name') // <- AND THIS
  .lean();

    const combinedInvestors = [...individualInvestors, ...institutionInvestors];

    return {
      data: JSON.parse(JSON.stringify(combinedInvestors)),
      totalPages: Math.ceil(
        (await Investor.countDocuments() + await InstitutionInvestor.countDocuments()) / params.limit
      ),
    };
  } catch (error) {
    handleError(error);
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

    return true;
  } catch (error) {
    handleError(error);
  }
};
