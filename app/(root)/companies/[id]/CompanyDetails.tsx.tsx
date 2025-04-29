"use client"
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Collection from "@/components/shared/Collection";
import { getCompanyById, getRelatedCompaniesByCategory } from "@/lib/actions/company.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import CompanySummary from "@/components/shared/CompanySummary";
import CompanyInvestments from "@/components/shared/CompanInvestments";
import CompanyPeople from "@/components/shared/CompanyPeople";
import CompanyTechnology from "@/components/shared/CompanyTechnology";
import CompanyNews from "@/components/shared/CompanyNews";
import InvestorNews from '@/components/shared/InvestorNews';

export interface CompanyDetailsProps {
  company: any;
  relatedCompanies: { data: any; totalPages: number; } | null | undefined;
  searchParams: any;
}

export default function CompanyDetails({ company, relatedCompanies, searchParams }: CompanyDetailsProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categoryIds = company.categories?.map((cat: { _id: any; }) => cat._id) || [];
  const categoryNames = company.categories?.map((cat: { name: any; }) => cat.name).join(', ') || 'N/A';

  let fundingTypeIds: string[] = [];
  let fundingTypeNames: string = 'N/A';

  if (Array.isArray(company.fundingTypes)) {
    if (typeof company.fundingTypes[0] === 'string') {
      fundingTypeIds = company.fundingTypes;
      fundingTypeNames = 'Funding types not loaded';
    } else {
      fundingTypeIds = company.fundingTypes.map((ft: { _id: any; }) => ft._id);
      fundingTypeNames = company.fundingTypes.map((ft: { name: any; }) => ft.name).join(', ');
    }
  }

  let sdgFocusIds: string[] = []
let sdgFocusName: string = 'N/A'

if (Array.isArray(company.sdgFocus)) {
  if (typeof company.sdgFocus[0] === 'string') {
    sdgFocusIds = company.sdgFocus;
    sdgFocusName = 'SDG focus not found';
  } else {
    sdgFocusIds = company.sdgFocus.map((sd: { _id: any }) => sd._id);
    sdgFocusName = company.sdgFocus.map((sd: { name: string }) => sd.name).join(', ');
  }
}

  const tabs = [
    { value: "summary", label: "Summary", content: <CompanySummary company={company} /> },
    { 
      value: "financials", 
      label: "Financials", 
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Annual Revenue: ${company.annualRevenue ?? 'N/A'}</p>
              <p>Revenue Expenditure : {company.annualExpenditure
 ?? 'N/A'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Funding</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Investment ASK: ${company.investmentAsk ?? 'N/A'}</p>
              //<p>Last SDG Focus : {sdgFocusName}</p>

            </CardContent>
          </Card>
        </div>
      )
    },
    { value: "investments", label: "Investments", content: <CompanyInvestments company={company} /> },
    { value: "people", label: "People", content: <CompanyPeople company={company} /> },
    { value: "technology", label: "Technology", content: <CompanyTechnology company={company} /> },
    { value: "news", label: "News And Events", content: <InvestorNews investor={company} /> },
  ];

  return (
    <div className="mx-auto relative max-w-7xl px-4 py-2 sm:px-6 lg:px-8 mb-1">
      <div className="bg-grey-50 p-8 xl:rounded-5xl xl:px-16 xl:py-20 relative w-full overflow-hidden rounded-3xl flex gap-10">
        <div className="ml-[160px] relative z-10"> {/* Adjust margin-left to make space for the image */}
          <h3 className="text-base font-semibold leading-7 text-gray-900">{company.organizationName}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{categoryNames}</p>
        </div>
        {/* Absolute positioning for the image */}
        <div className="absolute top-0 left-0 h-full w-[150px] flex items-center justify-center z-20 overflow-hidden rounded-3xl">
          <div className="w-full h-full bg-white transition-transform duration-300 transform scale-100 hover:scale-110 shadow-lg">
            <Image 
              src={company.imageUrl}
              alt="company image"
              fill
              className="object-contain object-center rounded-3xl mr-4 pr-2"
            />
          </div>
        </div>

      </div>
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

      <section className="wrapper mt-2 flex flex-col gap-2">
        <h2 className="h2-bold">Related Companies</h2>
        <Collection 
          data={relatedCompanies?.data || []}
          emptyTitle="No Companies Found"
          emptyStateSubtext="Come Back Later"
          collectionType="All_Companies"
          limit={6}
          page={searchParams.page ? Number(searchParams.page) : 1}
          totalPages={relatedCompanies?.totalPages || 1}
        />
      </section>
    </div>
  );
};
