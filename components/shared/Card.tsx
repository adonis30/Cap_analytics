import { ICompany } from '@/lib/database/models/company.model';
import { formatDateTime } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { DeleteConfirmation } from './DeleteConfirmation';

type CardProps = {
  company: ICompany;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = ({ company, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const isCompanyCreator = userId === company.companyCreator?._id?.toString();

  return (
    <div className='group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[430px]'>
      <Link 
        href={`/companies/${company._id}`}
        style={{ backgroundImage: `url(${company.imageUrl})` }}
        className='flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500'
      />
      {isCompanyCreator && !hidePrice && (
        <div className='absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all'>
          <Link href={`/companies/${company._id}/update`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>
          <DeleteConfirmation companyId={company._id} />
        </div>
      )}
      <Link
        href={`/companies/${company._id}`}
        className='flex min-h-[230px] flex-col gap-3 p-5 md:gap-4'
      >
        
          <div className='flex gap-2'>
            <span className='p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60'>
              {company.rankCompany}
            </span>
            {company.category && (
              <p className='p-semibold-14 w-auto rounded-full bg-gray-500/10 px-4 py-1 text-green-500 line-clamp-1'>
                {company.category.name}
              </p>
            )}
          </div>
        
        <p className='p-medium-16 p-medium-18 text-grey-500'>
          {company.fundedDate ? formatDateTime(company.fundedDate).dateOnly : 'Date not available'}
        </p>
        <p className='p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black'>
          {company.organizationName}
        </p>
        <div className='flex-between w-full'>
          <p className='p-medium-14 md:p-medium-16 text-grey-600'>
            {company.location} {company.url}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Card;