"use client"
// pages/demo.tsx or any other page file
import { columns } from "@/app/(root)/companies/columns";  // Adjust the import path if necessary
import { DataTable } from "./data-table"  // Adjust the import path if necessary
import { GetAllCompanyParams, Company } from "@/types";
import { Loader2, Building2 } from "lucide-react";

import { useEffect, useState } from 'react';
import { getAllCompanies } from "@/lib/actions/company.actions";

interface CompaniesData {
  data: Company[];
  totalPages: number;
}

const fallbackData: CompaniesData = {
  data: [],
  totalPages: 0,
};

const fetchData = async (query: string, category: string): Promise<CompaniesData> => {
  try {
    const params: GetAllCompanyParams = {
      query,
      limit: 6,
      page: 1,
      category,
    };

    const result = await getAllCompanies(params);
    

    if (!result) {
      throw new Error('No data returned');
    }

    return {
      data: result.data,
      totalPages: result.totalPages,
    };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return fallbackData;
  }
};

const Companies = () => {
  const [result, setResult] = useState<CompaniesData>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchData('', '');
      setResult(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Companies
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse and manage your company database
          </p>
        </div>
        
        <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : !result || result.data.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <Building2 className="h-12 w-12 mb-4" />
              <p className="text-xl font-medium">No companies found</p>
            </div>
          ) : (
            <DataTable columns={columns} data={result.data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;