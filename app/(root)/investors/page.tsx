'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { Loader2, Building2 } from 'lucide-react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridLogicOperator,
} from '@mui/x-data-grid';
import type { Theme } from '@mui/material/styles';
import { getAllInvestors, fetchCompanies } from '@/lib/actions/investor.actions';
import { Investor, GetAllInvestorsParams } from '@/types';

interface FundingType {
  _id: string;
  name: string;
}
interface FundingInstrument {
  _id: string;
  name: string;
}

interface InvestorsData {
  data: Investor[];
}
console.log("data", InvestorsData);
const fallbackData: InvestorsData = { data: [] };

const fetchData = async (query: string, category: string): Promise<InvestorsData> => {
  try {
    const params: GetAllInvestorsParams = { query, limit: 6, page: 1, category };
    const result = await getAllInvestors(params);
    if (!result) throw new Error('No data returned');
    return { data: result.data as Investor[] };
  } catch (error) {
    console.error('Error fetching investors:', error);
    return fallbackData;
  }
};

const Investors: React.FC = () => {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ pageSize: 10, page: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<InvestorsData>(fallbackData);
  const [companiesMap, setCompaniesMap] = useState<{ [key: string]: string }>({});
  console.log("result", result);
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
      headerName: 'Funding Instrument',
      width: 350,
      renderCell: (params) => (
        <span className="line-clamp-1">
          {params.value?.map((ft: FundingInstrument) => ft.name).join(', ')}
        </span>
      ),
    },
    { field: 'investorCategory',  headerName: 'Investor Category', width: 250},
    { field: 'ticketSize', headerName: 'Ticket Size', width: 250},
     
  ];
  
  const handleRowClick = (params: { id: any }) => {
    const investorId = String(params.id);
    router.push(`/investors/${investorId}`);
  };
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Institutions and Individual Investors
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
            Browse our comprehensive investor database
          </p>
        </div>

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
            <DataGrid<Investor>
  rows={result.data}
  columns={columns}
  getRowId={(row) => row._id}
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pagination
  onRowClick={handleRowClick}
  disableRowSelectionOnClick
  slotProps={{
    filterPanel: {
      logicOperators: [GridLogicOperator.And],
      columnsSort: 'asc',
      filterFormProps: {
        logicOperatorInputProps: { variant: 'outlined', size: 'small' },
        columnInputProps: { variant: 'outlined', size: 'small', sx: { mt: 'auto' } },
        operatorInputProps: { variant: 'outlined', size: 'small', sx: { mt: 'auto' } },
        valueInputProps: {
          InputComponentProps: { variant: 'outlined', size: 'small' },
        },
        deleteIconProps: {
          sx: {
            '& .MuiSvgIcon-root': { color: '#d32f2f' },
          },
        },
      },
      sx: {
        '& .MuiDataGrid-filterForm': { p: 2 },
        '& .MuiDataGrid-filterForm:nth-child(even)': {
          backgroundColor: (theme: Theme) =>
            theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
        },
        '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
        '& .MuiDataGrid-filterFormColumnInput': { mr: 2, width: 150 },
        '& .MuiDataGrid-filterFormOperatorInput': { mr: 2 },
        '& .MuiDataGrid-filterFormValueInput': { width: 200 },
      },
    },
  }}
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
  );
};

export default Investors;
