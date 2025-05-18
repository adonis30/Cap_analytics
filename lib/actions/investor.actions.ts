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
import TicketSize from '../database/models/ticketSize.model';
import Employee from '../database/models/employee.model';


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

export const enrichWithTicketSize = async (investor: any) => {
  if (!investor?.ticketSize?.length) return investor;

  const ticketSizes = await TicketSize.find({
    _id: { $in: investor.ticketSize },
  }).select('_id min max description');

  return {
    ...investor,
    ticketSize: ticketSizes,
  };
};

export const enrichEmployeeWithOrganization = async (employee: any) => {
  if (!employee.organizationId || employee.organizationType !== 'Investor') return employee;

  const organizationData = await Investor.findById(employee.organizationId)
    .select('_id name')
    .lean();

  return {
    ...employee,
    organization: organizationData,
  };
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

    const investor = await Investor.findById(investorId)
      .populate('fundingTypes', 'name')
      .populate('fundingRounds', 'name')
      .populate('fundingInstruments', 'name')
      .lean();

    if (investor) {
      return await enrichWithTicketSize(investor);
      
    }
   console.log("investor ID", investorId)
    const employeesRaw = await Employee.find({
  organizationId: investorId
}).lean();
   console.log("employeesRew", employeesRaw)
     const employees = await Promise.all(
      employeesRaw.map(enrichEmployeeWithOrganization)
    );
console.log("employees", employees)

    const institutionInvestor = await InstitutionInvestor.findById(investorId)
      .populate('fundingTypes', 'name')
      .populate('fundingRounds', 'name')
      .populate('fundingInstruments', 'name')
      .lean();

    if (institutionInvestor) {
      return await enrichWithTicketSize(institutionInvestor);
    }

    throw new Error('Investor not found');
  } catch (error) {
    handleError(error);
  }
};

export const getAllInvestors = async (params: GetAllInvestorsParams) => {
  try {
    await connectToDatabase();

    const individualInvestorsRaw = await Investor.find()
      .sort({ _id: 'desc' })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .populate('fundingTypes', 'name')
      .populate('fundingRounds', 'name')
      .populate('fundingInstruments', 'name')
      .lean();

    const institutionInvestorsRaw = await InstitutionInvestor.find()
      .sort({ _id: 'desc' })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .populate('fundingTypes', 'name')
      .populate('fundingRounds', 'name')
      .populate('fundingInstruments', 'name')
      .lean();

    // Enrich all investor records with ticketSize data
    const enrichedIndividuals = await Promise.all(
      individualInvestorsRaw.map(enrichWithTicketSize)
    );
    const enrichedInstitutions = await Promise.all(
      institutionInvestorsRaw.map(enrichWithTicketSize)
    );

    const combinedInvestors = [...enrichedIndividuals, ...enrichedInstitutions];

    const totalCount = await Investor.countDocuments() + await InstitutionInvestor.countDocuments();

    return {
      data: combinedInvestors,
      totalPages: Math.ceil(totalCount / params.limit),
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

export const getEmployeesByCompanyId = async (investorId: string) => {
  try {
    await connectToDatabase();

    const investor = await Investor.findById(investorId).select('_id name').lean();
    if (!investor) throw new Error('Investor not found');

    const employeesRaw = await Employee.find({ organizationId: investorId }).lean();

    const employees = await Promise.all(
      employeesRaw.map((employee) => ({
        ...employee,
        organization: {
          _id: investorId,
           
        },
      }))
    );

    return JSON.parse(JSON.stringify(employees));
  } catch (error) {
    handleError(error);
  }
};
