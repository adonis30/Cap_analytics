"use server"

import { CreateCategoryParams } from "@/types"
import { handleError } from "@/lib/utils"
import { connectToDatabase } from "@/lib/database"
import Category from "@/lib/database/models/category.model"

export const createCategory = async (categoryName: string): Promise<{
  id: string; value: string; label: string 
}> => {
  try {
    await connectToDatabase();
    const newCategory = await Category.create({ name: categoryName });
    return { 
      id: newCategory._id.toString(),
      value: newCategory._id.toString(), 
      label: newCategory.name 
    };
  } catch (error) {
    handleError(error);
    throw error; // Ensure to propagate the error
  }
};

export const getAllCategories = async () => {
  try {
    await connectToDatabase()

    const categories = await Category.find();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error)
    return [];
  }
}