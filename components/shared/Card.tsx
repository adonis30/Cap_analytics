'use client';

import { ICompany } from '@/lib/database/models/company.model';
import { formatDateTime } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { DeleteConfirmation } from './DeleteConfirmation';
import { Building2, Calendar, MapPin, Globe } from 'lucide-react';

type CardProps = {
  company: ICompany;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = ({ company, hasOrderLink, hidePrice }: CardProps) => {
 /*  const { userId } = useAuth();
  const isCompanyCreator = userId === company.companyCreator?._id?.toString(); */

  return (
    <div className='group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg w-full max-w-[300px]'>
      <div className='relative aspect-[16/9] w-full overflow-hidden'>
        <Image 
          src={company.imageUrl || '/assets/images/default-company.jpg'} 
          alt={company.organizationName} 
          fill
          style={{ objectFit: 'cover' }}
          className='transition-transform duration-300 group-hover:scale-105'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/assets/images/default-company.jpg';
          }}
        />
        <Link 
          href={`/companies/${company._id}`}
          className='absolute inset-0 z-10'
        >
          <span className="sr-only">View company details</span>
        </Link>
        {company.rankCompany && (
          <span className='absolute top-2 left-2 z-20 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white'>
          
          </span>
        )}
      </div>
      
      { !hidePrice && (
        <div className='absolute right-2 top-2 z-30 flex gap-2'>
        
        </div>
      )}
      
      <div className='flex flex-col gap-3 p-5'>
        <h3 className='text-xl font-semibold text-gray-800 line-clamp-2'>
          {company.organizationName}
        </h3>
        
        {company.category && (
          <span className='text-sm font-medium text-blue-600'>
            {company.category.name}
          </span>
        )}
        
        <div className='flex flex-col gap-2 text-sm text-gray-600'>
          <div className='flex items-center gap-2'>
            <Calendar className='h-4 w-4 flex-shrink-0' />
            <span className='truncate'>{company.fundedDate ? formatDateTime(company.fundedDate).dateOnly : 'Date not available'}</span>
          </div>
          <div className='flex items-center gap-2'>
            <MapPin className='h-4 w-4 flex-shrink-0' />
            <span className='truncate'>{company.location || 'Location not available'}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Globe className='h-4 w-4 flex-shrink-0' />
            <a href={company.url} target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:underline truncate'>
              {company.url || 'Website not available'}
            </a>
          </div>
        </div>
      </div>
      
      <Link
        href={`/companies/${company._id}`}
        className='mt-auto block bg-gray-100 p-4 text-center text-sm font-medium text-blue-600 hover:bg-gray-200'
      >
        View Details
      </Link>
    </div>
  );
};

export default Card;
