'use client'; // Ensure this is a client component

import * as React from 'react';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';
import { GetAllInvestorsParams, Investor } from '@/types';
import { Loader2, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchCompanies, getAllInvestors } from '@/lib/actions/investor.actions';
import { getAllCompanies } from '@/lib/actions/company.actions';
import { Collections } from '@/components/shared/Collections';
import { useRouter } from 'next/navigation';
import NewsList from '@/components/shared/NewsList';

interface FundingType {
  _id: string;
  name: string;
}

interface InvestorsData {
  data: Investor[];
}

const fallbackData: InvestorsData = {
  data: [],
};

const fetchData = async (query: string, category: string): Promise<InvestorsData> => {
  try {
    const params: GetAllInvestorsParams = {
      query,
      limit: 6,
      page: 1,
      category,
    };

    const result = await getAllInvestors(params);

    if (!result) {
      throw new Error('No data returned');
    }

    return {
      data: result.data as Investor[],
    };
  } catch (error) {
    console.error('Error fetching Investor:', error);
    return fallbackData;
  }
};

const Investors: React.FC = () => {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<InvestorsData>(fallbackData);
  const [companies, setCompanies] = useState([]);
  const [companiesMap, setCompaniesMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      const data = await fetchData('', '');
      setResult(data);

      const companiesData = await fetchCompanies();
      const companiesMapping: { [key: string]: string } = {};
      companiesData.forEach((company) => {
        companiesMapping[company.value] = company.label;
      });
      setCompaniesMap(companiesMapping);

      const companyResults = await getAllCompanies({ query: '', category: '', limit: 6, page: 1 });
      setCompanies(companyResults?.data ?? []);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const columns: GridColDef<Investor>[] = [
    { field: 'name', headerName: 'Name', width: 200, type: 'string' },
    { field: 'email', headerName: 'Email', width: 250, type: 'string' },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150, type: 'string' },
    { field: 'type', headerName: 'Type', width: 150, type: 'string' },
    { field: 'totalAmountFunded', headerName: 'Total Amount Funded', width: 200, type: 'number' },
    { field: 'highestAmountFunded', headerName: 'Highest Amount Funded', width: 200, type: 'number' },
    {
      field: 'fundedCompanies',
      headerName: 'Funded Companies',
      width: 300,
      type: 'string',
      renderCell: (params) => (
        <div className="line-clamp-1">
          {params.row.fundedCompaniesIds?.map((id) => companiesMap[id] || id).join(', ')}
        </div>
      ),
    },
    {
      field: 'fundingTypes',
      headerName: 'Funding Types',
      width: 250,
      type: 'string',
      renderCell: (params) => (
        <div className="line-clamp-1">
          {params.value.map((type: FundingType) => type.name).join(', ')}
        </div>
      ),
    },
  ];

  const handleRowClick = (params: { id: GridRowId }) => {
    const investorId = String(params.id);
    router.push(`/investors/${investorId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Institutions and Individual Investors
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse our Investor database
          </p>
        </div>

        <div className="mt-12 flex">
          <div className="w-1/5 p-4">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="font-bold">Latest Companies</h2>
              <Collections />
            </div>
          </div>

          <div className="w-[60%]">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : !result?.data?.length ? (
                <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                  <Building2 className="h-12 w-12 mb-4" />
                  <p className="text-xl font-medium">No Investors found</p>
                </div>
              ) : (
                <Box sx={{ height: 500, width: '100%' }}>
                  <DataGrid
                    rows={result.data}
                    columns={columns}
                    getRowId={(row) => row._id}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pagination
                    checkboxSelection
                    onRowClick={(params) => handleRowClick(params)}
                  />
                </Box>
              )}
            </div>
          </div>

          <div className="w-1/5 p-4">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="font-bold">Latest News</h2>
              <NewsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investors;
