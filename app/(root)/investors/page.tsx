'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';
import { GetAllInvestorsParams, Investor } from '@/types';
import { fetchCompanies, getAllInvestors } from '@/lib/actions/investor.actions';
import { getAllCompanies } from '@/lib/actions/company.actions';
import { useRouter } from 'next/navigation';
import { Loader2, Building2 } from 'lucide-react';

interface FundingType {
  _id: string;
  name: string;
}
interface FundingInstruments {
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

    if (!result) throw new Error('No data returned');

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
  const [companiesMap, setCompaniesMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      const data = await fetchData('', '');
      setResult(data);

      const companiesData = await fetchCompanies();
      const companiesMapping: { [key: string]: string } = {};
      companiesData.forEach((company: { value: string; label: string }) => {
        companiesMapping[company.value] = company.label;
      });
      setCompaniesMap(companiesMapping);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const columns: GridColDef<Investor>[] = [
    { field: 'name', headerName: 'Investor Name', width: 200 },
    { field: 'type', headerName: 'Investor Type', width: 150 },
    {
      field: 'fundingInstruments',
      headerName: 'Funding instruments',
      width: 250,
      renderCell: (params) => (
        <span className="line-clamp-1">
         { /**{params.value.map((type: FundingInstruments) => type.name).join(', ')}*/}
        </span>
      ),
    },
    {
      field: 'fundingTypes',
      headerName: 'Funding rounds',
      width: 250,
      renderCell: (params) => (
        <span className="line-clamp-1">
          {params.value.map((type: FundingType) => type.name).join(', ')}
        </span>
      ),
    },
    
   
  ];

  const handleRowClick = (params: { id: GridRowId }) => {
    const investorId = String(params.id);
    router.push(`/investors/${investorId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Institutions and Individual Investors
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
            Browse our comprehensive investor database
          </p>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
          ) : result.data.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <Building2 className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No investors found</p>
            </div>
          ) : (
            <Box className="bg-white shadow-lg rounded-lg overflow-hidden">
              <DataGrid
                rows={result.data}
                columns={columns}
                getRowId={(row) => row._id}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pagination
                onRowClick={handleRowClick}
                sx={{
                  '& .MuiDataGrid-cell': { borderBottom: 'none' },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8fafc',
                    borderBottom: 'none',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 },
                  '& .MuiDataGrid-footerContainer': { borderTop: 'none' },
                  '& .MuiDataGrid-row': { cursor: 'pointer' },
                }}
              />
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investors;
