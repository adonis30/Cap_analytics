import { getCompanyById, getRelatedCompaniesByCategory } from "@/lib/actions/company.actions";

import CompanyDetails from "./CompanyDetails.tsx";

export default async function Page({ params: { id }, searchParams }: { params: { id: string }, searchParams: any }) {
  const company = await getCompanyById(id);

  const categoryIds = company.categories?.map((cat: { _id: any; }) => cat._id) || [];

  const relatedCompanies = categoryIds.length > 0
    ? await getRelatedCompaniesByCategory({
        categoryId: categoryIds[0],
        companyId: company._id,
        page: searchParams.page as string,
      })
    : null;

  return <CompanyDetails company={company} relatedCompanies={relatedCompanies} searchParams={searchParams} />;
}