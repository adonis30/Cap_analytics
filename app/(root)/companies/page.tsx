'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridLogicOperator,
} from '@mui/x-data-grid';
import { Loader2, Building2 } from 'lucide-react';
import type { Theme } from '@mui/material/styles';

import { getAllCompanies } from '@/lib/actions/company.actions';
import { Company, GetAllCompanyParams } from '@/types';

interface CompaniesData {
  data: Company[];
  totalPages: number;
}

const fallbackData: CompaniesData = {
  data: [],
  totalPages: 0,
};

const fetchCompaniesData = async (query: string, category: string): Promise<CompaniesData> => {
  try {
    const params: GetAllCompanyParams = {
      query,
      category,
      limit: 10,
      page: 1,
    };

    const result = await getAllCompanies(params);
    if (!result) throw new Error('No data returned');
    return {
      data: result.data as Company[],
      totalPages: result.totalPages,
    };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return fallbackData;
  }
};

const Companies: React.FC = () => {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ pageSize: 10, page: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<CompaniesData>(fallbackData);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchCompaniesData('', '');
      setResult(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const columns: GridColDef<Company>[] = [
    { field: 'organizationName', headerName: 'Company Name', width: 250 },
    {
      field: 'sector',
      headerName: 'Sector',
      width: 300,
      renderCell: (params) => (
        <span className="line-clamp-1">
          {Array.isArray(params.row.sector)
            ? params.row.sector.map((s: { name: string }) => s.name).join(', ')
            : 'N/A'}
        </span>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 180,
      renderCell: (params) => <span>{params.row.location || 'N/A'}</span>,
    },
    {
      field: 'contactEmail',
      headerName: 'Email',
      width: 250,
      renderCell: (params) => <span>{params.row.contactEmail || 'N/A'}</span>,
    },
    {
      field: 'contactNumber',
      headerName: 'Phone',
      width: 180,
      renderCell: (params) => <span>{params.row.contactNumber || 'N/A'}</span>,
    },
  ];

  const handleRowClick = (params: { id: any }) => {
    const companyId = String(params.id);
    router.push(`/companies/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Company Directory
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
            Explore companies across sectors and funding stages.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          </div>
        ) : result.data.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <Building2 className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No companies found</p>
          </div>
        ) : (
          <Box className="bg-white shadow-lg rounded-lg overflow-hidden">
            <DataGrid<Company>
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

export default Companies;
