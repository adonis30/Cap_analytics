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

const CompanyDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const company = await getCompanyById(id);

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

  const relatedCompanies = categoryIds.length > 0
    ? await getRelatedCompaniesByCategory({
        categoryId: categoryIds[0],
        companyId: company._id,
        page: searchParams.page as string,
      })
    : null;

  const tabs = [
    { 
      value: "summary", 
      label: "Summary", 
      content: (
        <div className="mt-6 border-t border-gray-100">
          <CompanySummary company={company} />
        </div>
      )
    },
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
              <p>Revenue Growth: {company.revenueGrowth ?? 'N/A'}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Funding</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total Funding: ${company.totalFunding ?? 'N/A'}</p>
              <p>Last Funding Date: {company.lastFundingDate ?? 'N/A'}</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    { 
      value: "investments", 
      label: "Investments", 
      content: (
        <CompanyInvestments company={company} />
      )
    },
    { 
      value: "people", 
      label: "People", 
      content: (
        <CompanyPeople company={company} />
      )
    },
    { 
      value: "technology", 
      label: "Technology", 
      content: (
        <CompanyTechnology company={company} />
      )
    },
    { 
      value: "news", 
      label: "News And Events", 
      content: (
        <CompanyNews company={company} />
      )
    },
  ];

  return (
    <>
    <div className="mx-auto relative max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
      <div>
      <Tabs defaultValue="summary" className="py-5 min-h-[300px]">
        <TabsList className="flex flex-wrap justify-start gap-2 bg-white text-black font-semibold">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-200 focus:bg-gray-300 focus:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Related Companies section */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
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
    
    </div>
    
    </>
  );
};

export default CompanyDetails;