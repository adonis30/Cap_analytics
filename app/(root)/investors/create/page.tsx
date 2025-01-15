"use client";

import IndividualInvestorForm from '@/components/shared/IndividualInvestorForm';
import InstitutionInvestorForm from '@/components/shared/InstitutionInvestorForm';
import { Tab } from '@/components/ui/tab';
import { getAllCategories } from '@/lib/actions/category.actions';
import { getAllFundingTypes } from '@/lib/actions/fundingType.actions';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';


const CreateInvestor = () => {
  
  const [userId, setUserId] = useState<string | undefined>(undefined); // Declare userId state
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

  const { userId: authUserId } = useAuth();

  useEffect(() => {
    const fetchUserId = () => {
      const id = authUserId; // Use authUserId from useAuth
      if (id !== null) setUserId(id); // Ensure id is not null
    };

    fetchUserId(); // Call the function to fetch user ID
  }, [authUserId]); // Dependency array to run effect when authUserId changes



  const tabs = [
    {
      title: "Create Individual Investor",
      value: "createIndividualInvestor",
    content: <IndividualInvestorForm userId={userId || ''} type="Individual" initialCategoryIds={[]} initialFundingTypeIds={[]} />,
    },
    {
      title: "Create Institution Investor",
      value: "CreateInstitutionInvestor",
      content: <InstitutionInvestorForm userId={userId || ''} initialCategoryIds={[]} initialFundingTypeIds={[]} type="Create" />,
    },
  ];



  return (
    <>
      <section className='bg-primary-50 text-center bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <h3 className="wrapper h3-bold text-center sm:text-left">Add an Investor</h3>
      </section>

      <div className='wrapper my-8'>
      <h1 className="text-2xl font-bold mb-4">Investor Creation</h1>
      <Tab tabs={tabs} />
      </div>
    </>
  );
};

export default CreateInvestor;