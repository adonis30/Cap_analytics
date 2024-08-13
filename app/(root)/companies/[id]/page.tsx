import Collection from "@/components/shared/Collection";
import { getCompanyById, getRelatedCompaniesByCategory } from "@/lib/actions/company.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from "react";


const CompanyDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const company = await getCompanyById(id);

  const categoryIds = company.categories?.map((cat: { _id: any; }) => cat._id) || [];
  const categoryNames = company.categories?.map((cat: { name: any; }) => cat.name).join(', ') || 'N/A';

  let fundingTypeIds: string[] = [];
  let fundingTypeNames: string = 'N/A';

  if (Array.isArray(company.fundingTypes)) {
    if (typeof company.fundingTypes[0] === 'string') {
      // If fundingTypes are not populated, they're just strings (IDs)
      fundingTypeIds = company.fundingTypes;
      fundingTypeNames = 'Funding types not loaded';
    } else {
      // If fundingTypes are populated, they're objects with _id and name
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
      <TabsList className="flex flex-col sm:flex-row gap-0 sm:gap-0.5 rounded-xl bg-white text-black font-semibold">
        <TabsTrigger
          value="summary"
          className="py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-200 focus:bg-gray-300 focus:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Summary
        </TabsTrigger>
        <TabsTrigger
          value="financials"
          className="py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-200 focus:bg-gray-300 focus:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Financials
        </TabsTrigger>
        <TabsTrigger
          value="investments"
          className="py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-200 focus:bg-gray-300 focus:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Investments
        </TabsTrigger>
        <TabsTrigger
          value="people"
          className="py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-200 focus:bg-gray-300 focus:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          People
        </TabsTrigger>
        <TabsTrigger
          value="technology"
          className="py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-200 focus:bg-gray-300 focus:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Technology
        </TabsTrigger>
        <TabsTrigger
          value="news"
          className="py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-200 focus:bg-gray-300 focus:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          News And Events
        </TabsTrigger>
      </TabsList>
  <TabsContent value="summary">
  <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Company Name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{company.organizationName}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Industries</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{categoryNames}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Company Funding Types</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{fundingTypeNames}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Number of Employees</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">1000+</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Company Headquaters location</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{company.location}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Company website</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <a href={company.url} target="_blank" rel="noopener noreferrer">{company.url}</a>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">About company</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {company.description}
            </dd>
          </div>
        </dl>
      </div>
{/* COMPANIES FROM THE SAME CATEGORY*/}
<section className="wrapper my-8 flex flex-col gap-8 md:gap-12" >
    <h2 className="h2-bold">
    Related Companies
    </h2>
    <Collection 
       data={relatedCompanies?.data}
       emptyTitle="No Companies Found"
       emptyStateSubtext="Come Back Later"
       collectionType="All_Companies"
      limit={6}
      page={1}
      totalPages={2}
      
       />
    </section>
  </TabsContent>
  <TabsContent value="financials">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Annual Revenue: ${company.annualRevenue || 'N/A'}</p>
          <p>Revenue Growth: {company.revenueGrowth || 'N/A'}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Funding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Funding: ${company.totalFunding || 'N/A'}</p>
          <p>Last Funding Date: {company.lastFundingDate || 'N/A'}</p>
        </CardContent>
      </Card>
    </div>
  </TabsContent>

  <TabsContent value="investments">
    <Card>
      <CardHeader>
        <CardTitle>Investment History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {company.investments?.map((investment: { date: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; amount: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; type: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, index: Key | null | undefined) => (
            <li key={index}>
              {investment.date}: ${investment.amount} ({investment.type})
            </li>
          )) || <li>No investment data available</li>}
        </ul>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="people">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {company.keyPeople?.map((person: { name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; position: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; linkedin: string | undefined; }, index: Key | null | undefined) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{person.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Position: {person.position}</p>
            <p>LinkedIn: <a href={person.linkedin} target="_blank" rel="noopener noreferrer">Profile</a></p>
          </CardContent>
        </Card>
      )) || <p>No key people data available</p>}
    </div>
  </TabsContent>

  <TabsContent value="technology">
    <Card>
      <CardHeader>
        <CardTitle>Tech Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5">
          {company.techStack?.map((tech: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
            <li key={index}>{tech}</li>
          )) || <li>No tech stack data available</li>}
        </ul>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="news">
    <div className="space-y-4">
      {company.newsAndEvents?.map((item: { title: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; date: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; description: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; link: string | undefined; }, index: Key | null | undefined) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{item.date}</p>
            <p>{item.description}</p>
            {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">Read more</a>}
          </CardContent>
        </Card>
      )) || <p>No news or events available</p>}
    </div>
  </TabsContent>
</Tabs>

         </div>
      
    </div>
    
    </>
  );
};

export default CompanyDetails;