'use server'

import mongoose from 'mongoose';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import { CreateCompanyParams, DeleteCompanyParams, GetAllCompanyParams, GetRelatedCompaniesByCategoryParams, UpdateCompanyParams } from '@/types';
import User from '../database/models/user.model';
import Company from '../database/models/company.model';
import Category from '../database/models/category.model';
import { revalidatePath } from 'next/cache';
import { isValidObjectId } from 'mongoose';
import FundingType from '@/lib/database/models/fundingType.model';

const populateCompany = async (query: any) => {
  return query
    .populate({ path: 'companyCreator', model: User, select: '_id firstName lastName' })
    .populate({ path: 'categories', model: Category, select: '_id name' })
    .populate({ path: 'fundingTypes', model: FundingType, select: '_id name' });
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
      fundingTypes: company.fundingTypeIds
    });

    await Category.updateMany(
      { _id: { $in: categoryIds } },
      { $push: { companies: newCompany._id } }
    );

    const populatedCompany = await Company.findById(newCompany._id)
      .populate('categories')
      .populate('fundingTypes')
      .lean();

    return JSON.parse(JSON.stringify(populatedCompany));
  } catch (error) {
    handleError(error);
  }
};

export const deleteCompnay = async ({ companyId, path }: DeleteCompanyParams) => {
  try {
    await connectToDatabase();

    const deleteCompnay = await Company.findByIdAndDelete(companyId);

    if (deleteCompnay) revalidatePath(path);
    
  } catch (error) {
    handleError(error);
  }
};

export async function updateCompany({ userId, company, path }: UpdateCompanyParams) {
  try {
    await connectToDatabase()

    const companyToUpdate = await Company.findById(company._id)
    if (!companyToUpdate || companyToUpdate.companyCreator.toString() !== userId) {
      throw new Error('Unauthorized or company not found')
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      { ...company, category: company.categoryIds },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedCompany))
  } catch (error) {
    handleError(error)
  }
}

export async function getRelatedCompaniesByCategory({
  categoryId,
  companyId,
  limit = 3,
  page = 1,
}: GetRelatedCompaniesByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    
    const currentCompany = await Company.findById(companyId).select('categories');

    const conditions = { 
      categories: { $in: currentCompany.categories }, 
      _id: { $ne: companyId } 
    }

    const companiesQuery = Company.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const companies = await populateCompany(companiesQuery)
    const companiesCount = await Company.countDocuments(conditions)

    return { 
      data: JSON.parse(JSON.stringify(companies)), 
      totalPages: Math.ceil(companiesCount / limit) 
    }
  } catch (error) {
    handleError(error)
  }
}

export async function getCompanyById(companyId: string) {
  try {
    await connectToDatabase();
    
    const company = await Company.findById(companyId)
      .populate('categories')
      .populate('fundingTypes')
      .lean();
      
    if (!company) throw new Error('Company not found');
    
    return JSON.parse(JSON.stringify(company));
  } catch (error) {
    handleError(error);
  }
}

export async function getAllCompanies(params: GetAllCompanyParams) {
  try {
    await connectToDatabase();
    const companies = await Company.find()
      .sort({ createdAt: 'desc' })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .populate('categories', 'name')
      .populate('fundingTypes', 'name')
      .lean();
    
    return {
      data: JSON.parse(JSON.stringify(companies)),
      totalPages: Math.ceil(await Company.countDocuments() / params.limit)
    };
  } catch (error) {
    handleError(error);
  }
}