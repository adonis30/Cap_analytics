import { ICompany } from '@/lib/database/models/company.model';
import React from 'react';
import Card from './Card';

type CollectionProps = {
  data: ICompany[];
  emptyTitle: string;
  emptyStateSubtext: string;
  page: number | string;
  limit: number;
  totalPages?: number;
  urlParamName?: string;
  collectionType?: 'Companies_Created' | 'My_Companies' | 'All_Companies';
};

const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType,
  urlParamName,
  limit
}: CollectionProps) => {
  

  return (
    <>
      {data.length > 0 ? (
        <div className='flex flex-col items-center gap-10'>
          <ul className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10'>
            {data.map((company) => {
              const hasOrderLink = collectionType === 'Companies_Created';
              const hidePrice = collectionType === 'My_Companies';

              // Ensure 'key' prop is directly assigned to the <li> element
              return (
                <li key={company._id} className='flex justify-center'>
                  <Card company={company} hasOrderLink={hasOrderLink} hidePrice={hidePrice} />
                </li>
              )
            })}
          </ul>
        </div>
      ): (
        <div className='flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[140px] bg-grey-50 py-28 text-center'>
          <h3 className='p-bold-20 md:h5-bold'>{emptyTitle}</h3>
          <p className='p-regular-14'>{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default Collection;
