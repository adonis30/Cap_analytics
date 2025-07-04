import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getAllCompanies } from "@/lib/actions/company.actions";
import Image from "next/image";
import Link from "next/link";
import CarouselBanner from "@/components/shared/CarouselBanner"; // Adjust path as needed


export default async function Home() {
  const companies = await getAllCompanies({
    query: '',
    category: '',
    page: 1,
    limit: 6
  })
  

  return (
    <>
  <CarouselBanner />

  <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
    <h2 className="h2-bold">Trusted by <br/> Many Investors and Businesses</h2>

    <div className="flex w-full flex-col gap-5 md:flex-row">
      {/* Replace with actual Search and CategoryFilter components */}
      Search
      CategoryFilter
    </div>

    <Collection 
      data={companies?.data}
      emptyTitle="No Businesses Found"
      emptyStateSubtext="Come Back Later"
      collectionType="All_Companies"
      limit={6}
      page={1}
      totalPages={3}
    />
  </section>
</>

  );
}
