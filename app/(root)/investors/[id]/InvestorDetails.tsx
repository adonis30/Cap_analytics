"use client"

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Collection from "@/components/shared/Collection";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InvestorNews from '@/components/shared/InvestorNews';
import InvestorInvestments from '@/components/shared/InvestorInvestments';
import InvestorSummary from '@/components/shared/InvestorSummary';
import { getInvestorById, getAllInvestors } from '@/lib/actions/investor.actions';


export interface InvestorDetailsProps {
    investor: any;
    relatedInvestors: { data: any; totalPages: number; } | null | undefined;
    searchParams: any;
  }
  
  export default function InvestorDetails({ investor, relatedInvestors, searchParams }: InvestorDetailsProps) {
    const [activeTab, setActiveTab] = useState('summary');
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);
  
    const categoryIds = investor.categories?.map((cat: { _id: any; }) => cat._id) || [];
    const categoryNames = investor.categories?.map((cat: { name: any; }) => cat.name).join(', ') || 'N/A';
  
    let fundingTypeIds: string[] = [];
    let fundingTypeNames: string = 'N/A';
  
    if (Array.isArray(investor.fundingTypes)) {
      if (typeof investor.fundingTypes[0] === 'string') {
        fundingTypeIds = investor.fundingTypes;
        fundingTypeNames = 'Funding types not loaded';
      } else {
        fundingTypeIds = investor.fundingTypes.map((ft: { _id: any; }) => ft._id);
        fundingTypeNames = investor.fundingTypes.map((ft: { name: any; }) => ft.name).join(', ');
      }
    }

  // Define tabs
  const tabs = [
    { value: "summary", label: "Profile", content: <InvestorSummary investor={investor} /> },
    { 
      value: "investments", 
      label: "Investments", 
      content: <InvestorInvestments investments={investor?.fundedCompaniesIds || []} /> // Pass relevant data
    },
    { 
      value: "people", 
      label: "People", 
      content: <InvestorNews investor={investor} />
    },
    { 
      value: "news", 
      label: "News & Updates", 
      content: <InvestorNews investor={investor} />
    },
  ];

  return (
    <div className="mx-auto relative max-w-7xl px-4 py-2 sm:px-6 lg:px-8 mb-1">
      <div className="bg-grey-50 p-8 xl:rounded-5xl xl:px-16 xl:py-20 relative w-full overflow-hidden rounded-3xl flex gap-10">
        <div className="ml-[160px] relative z-10">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{investor.name}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {investor.type === 'Individual' ? 'Individual Investor' : 'Institutional Investor'}
          </p>
        </div>

        {/* Investor image */}
        <div className="absolute top-0 left-0 h-full w-[150px] flex items-center justify-center z-20 overflow-hidden rounded-3xl">
          <div className="w-full h-full bg-white transition-transform duration-300 transform scale-100 hover:scale-110 shadow-lg">
            <Image 
              src={investor?.institutionDetails?.imageUrl}
              alt="investor image"
              fill
              className="object-contain object-center rounded-3xl mr-4 pr-2"
           />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5">
      {isMobile ? (
          <div className="relative mb-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full py-1 px-3 pr-6 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {tabs.map((tab) => (
                <option key={tab.value} value={tab.value}>
                  {tab.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" size={20} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="py-1 min-h-[100px]">
            <TabsList className="flex flex-wrap justify-start gap-1 bg-white text-black font-semibold mb-2">
              {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="py-1 px-3 rounded-lg focus:outline-none hover:bg-gray-200 focus:bg-gray-300 focus:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          </Tabs>
)}
           <div className="mt-2">
          {tabs.find(tab => tab.value === activeTab)?.content}
        </div>
      </div>
      {/* Related Investors */}
      <section className="wrapper mt-2 flex flex-col gap-2">
        <h2 className="h2-bold">Related Investors</h2>
        <Collection 
          data={relatedInvestors?.data || []}
          emptyTitle="No Investors Found"
          emptyStateSubtext="Check back later for updates."
          collectionType="All_Companies"
          limit={6}
          page={1} // Use get method
          totalPages={relatedInvestors?.totalPages ||  1}
        />
      </section>
    </div>
  );
}
