'use client';

//import CompaniesForm from '@/components/shared/CompaniesForm';
import { getAllCategories } from '@/lib/actions/category.actions';
import { useEffect, useState } from 'react';
import { getAllFundingTypes } from '@/lib/actions/fundingType.actions';
import { getUserId } from '@/lib/actions/getUser.actions';

const CreateCompany = () => {
  const [userId, setUserId] = useState<string | null>(null);  // Initialize userId state
  const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);
  const [fundingTypes, setFundingTypes] = useState<{ _id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [categoryList, fundingTypeList] = await Promise.all([
        getAllCategories(),
        getAllFundingTypes()
      ]);
      if (categoryList) setCategories(categoryList);
      if (fundingTypeList) setFundingTypes(fundingTypeList);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch userId and data when the component mounts
  useEffect(() => {
    const fetchUserIdAndData = async () => {
      const fetchedUserId = await getUserId();
      setUserId(fetchedUserId);
      await fetchData();
    };

    fetchUserIdAndData();
  }, []); // Empty dependency array to run once when the component mounts

  if (isLoading || userId === null) {
    return <div>Loading...</div>; // Loading state while fetching data
  }

  return (
    <>
      <section className='bg-primary-50 text-center bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <h3 className=" wrapper h3-bold text-center sm:text-left">Add a Company</h3>
      </section>

      <div className='wrapper my-8'>
       {/*  <CompaniesForm 
          userId={userId}
          type="Create"
          initialCategoryIds={categories.map(category => category._id)}
          initialFundingTypeIds={fundingTypes.map(type => type._id)}
        /> */}
      </div>
    </>
  );
};

export default CreateCompany;
