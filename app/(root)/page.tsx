import Collection from "@/components/shared/Collection";
import { getAllCompanies } from "@/lib/actions/company.actions";
import CarouselBanner from "@/components/shared/CarouselBanner";

export default async function Home() {
  const companies = await getAllCompanies({
    query: '',
    category: '',
    page: 1,
    limit: 6
  });

  return (
    <>
    

      <section id="events" className="wrapper my-10 flex flex-col gap-8 md:gap-12 px-4 md:px-8">
        <CarouselBanner />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Trusted by <br className="hidden md:block" /> Many Investors and Businesses
        </h2>
        
        
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
