'use server';

import mongoose from 'mongoose';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import {
  CreateCompanyParams,
  DeleteCompanyParams,
  GetAllCompanyParams,
  GetRelatedCompaniesByCategoryParams,
  UpdateCompanyParams,
} from '@/types';

import User from '../database/models/user.model';
import Company from '../database/models/company.model';
import Category from '../database/models/category.model';
import SdgFocus from '../database/models/sdgfocus.model';
import FundingType from '@/lib/database/models/fundingType.model';
import FundingInstruments from '../database/models/fundingInstruments.model';
import FundingRounds from '../database/models/fundingRounds.model';
import Sector from '../database/models/sector.model';
import InvestmentAsk from '@/lib/database/models/investmentAsk.model';
import Employee from '../database/models/employee.model';
import { revalidatePath } from 'next/cache';
import { isValidObjectId } from 'mongoose';

const populateCompany = async (query: any) => {
  return query
    .populate({ path: 'companyCreator', model: User, select: '_id firstName lastName' })
    .populate({ path: 'categories', model: Category, select: '_id name' })
    .populate({ path: 'fundingTypes', model: FundingType, select: '_id name' })
    .populate({ path: 'sdgFocus', model: SdgFocus, select: '_id name' })
    .populate({ path: 'fundingInstruments', model: FundingInstruments, select: '_id name' })
    .populate({ path: 'fundingRounds', model: FundingRounds, select: '_id name' })
    .populate({ path: 'sector', model: Sector, select: '_id name' });
};

// Manually enrich company with investmentAsk details
const enrichWithInvestmentAsk = async (company: any) => {
  if (!company?.investmentAsk?.length) return company;

  const investmentAsks = await InvestmentAsk.find({
    _id: { $in: company.investmentAsk },
  }).select('_id min max description');

  return {
    ...company,
    investmentAsk: investmentAsks,
  };
};

export const enrichEmployeeWithOrganization = async (employee: any) => {
  if (!employee.organizationId || employee.organizationType !== 'Company') return employee;

  const organizationData = await Company.findById(employee.organizationId)
    .select('_id name')
    .lean();

  return {
    ...employee,
    organization: organizationData,
  };
};

export const createCompany = async ({ company, userId, path }: CreateCompanyParams) => {
  try {
    await connectToDatabase();

    const categoryIds = company.categoryIds.map(id => new mongoose.Types.ObjectId(id));
    const creatorId = isValidObjectId(userId) ? userId : undefined;

    const newCompany = await Company.create({
      ...company,
      categories: categoryIds,
      companyCreator: creatorId,
      fundingTypes: company.fundingTypeIds,
    });

    await Category.updateMany(
      { _id: { $in: categoryIds } },
      { $push: { companies: newCompany._id } }
    );

    let populated = await Company.findById(newCompany._id)
      .populate('categories')
      .populate('fundingTypes')
      .populate('sdgFocus')
      .populate('fundingRounds')
      .populate('fundingInstruments')
      .populate('sector')
      .lean();

    populated = await enrichWithInvestmentAsk(populated);

    return JSON.parse(JSON.stringify(populated));
  } catch (error) {
    handleError(error);
  }
};

export const deleteCompnay = async ({ companyId, path }: DeleteCompanyParams) => {
  try {
    await connectToDatabase();
    const deleted = await Company.findByIdAndDelete(companyId);
    if (deleted) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
};

export async function updateCompany({ userId, company, path }: UpdateCompanyParams) {
  try {
    await connectToDatabase();

    const companyToUpdate = await Company.findById(company._id);
    if (!companyToUpdate || companyToUpdate.companyCreator.toString() !== userId) {
      throw new Error('Unauthorized or company not found');
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      { ...company, category: company.categoryIds },
      { new: true }
    );

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedCompany));
  } catch (error) {
    handleError(error);
  }
}

export async function getCompanyById(companyId: string) {
  try {
    await connectToDatabase();

    const companyRaw = await Company.findById(companyId)
      .populate('categories')
      .populate('fundingTypes')
      .populate('sdgFocus')
      .populate('fundingRounds')
      .populate('fundingInstruments')
      .populate('sector')
      .lean();

    if (!companyRaw) {
      throw new Error('Company not found');
    }

    const company = await enrichWithInvestmentAsk(companyRaw);

    const employeesRaw = await Employee.find({
    organizationId: new mongoose.Types.ObjectId(companyId),
    organizationType: "Company"
    }).lean();
     console.log("empDta", employeesRaw);
     console.log("Id", companyId);
    const employees = await Promise.all(
      employeesRaw.map(enrichEmployeeWithOrganization)
    );

    // Add logging here
    console.log('Fetched Employees:', employees);

    return JSON.parse(JSON.stringify({
      ...company,
      employees,
      employeeCount: employees.length,
    }));
  } catch (error) {
    handleError(error);
  }
}


export async function getAllCompanies(params: GetAllCompanyParams) {
  try {
    await connectToDatabase();

    const companiesRaw = await Company.find()
      .sort({ createdAt: 'desc' })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .populate('categories')
      .populate('fundingTypes')
      .populate('sdgFocus')
      .populate('fundingRounds')
      .populate('fundingInstruments')
      .populate('sector')
      .lean();

    const companies = await Promise.all(companiesRaw.map(enrichWithInvestmentAsk));

    return {
      data: JSON.parse(JSON.stringify(companies)),
      totalPages: Math.ceil(await Company.countDocuments() / params.limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getRelatedCompaniesByCategory({
  categoryId,
  companyId,
  limit = 3,
  page = 1,
}: GetRelatedCompaniesByCategoryParams) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const currentCompany = await Company.findById(companyId).select('categories');
    const conditions = {
      categories: { $in: currentCompany.categories },
      _id: { $ne: companyId },
    };

    const query = Company.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const companiesRaw = await populateCompany(query.lean());

    const companies = await Promise.all(companiesRaw.map(enrichWithInvestmentAsk));
    const companiesCount = await Company.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(companies)),
      totalPages: Math.ceil(companiesCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
