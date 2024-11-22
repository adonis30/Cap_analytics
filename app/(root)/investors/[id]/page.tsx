import { getInvestorById, getRelatedInvestorsByCategory } from "@/lib/actions/investor.actions";
import InvestorDetails from "./InvestorDetails";

export default async function Page({params: { id }, searchParams}:{ params: { id: string }, searchParams: any }) {
  const investor = await getInvestorById(id);

  const categoryIds = investor.categories?.map((cat: {_id: any;}) => cat._id) || [];

  const relatedInvestors = categoryIds.length > 0 
  ? await getRelatedInvestorsByCategory ({
    categoryId: categoryIds[0] || '',
    investorId: investor._id,
    page: searchParams.page as string,
  })
  : null

  return <InvestorDetails investor={investor} relatedInvestors={relatedInvestors} searchParams={searchParams} />;
}


