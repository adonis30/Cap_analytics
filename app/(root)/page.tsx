import React from "react";
import Collection from "@/components/shared/Collection";
import { getAllCompanies } from "@/lib/actions/company.actions";
import CarouselBanner from "@/components/shared/CarouselBanner";


type BlogPost = {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  category: string;
  summary: string;
  imageUrl: string;
};

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top Investment Trends for 2024",
    author: "Jane Doe",
    publishDate: "November 20, 2024",
    category: "Market Trends",
    summary: "Explore the latest investment trends shaping the market in 2024.",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    id: "2",
    title: "How to Attract Investors to Your Startup",
    author: "John Smith",
    publishDate: "November 15, 2024",
    category: "Investor Tips",
    summary: "Proven strategies to capture investor interest and secure funding.",
    imageUrl: "https://via.placeholder.com/400x200",
  },
];

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
        <div className=" border border-n-1/10 rounded-3xl overflow-hidden lg:p-5">
          <h1 className="text-2xl text-center md:text-3xl font-bold text-gray-800">
          A Bridge Between Capital and Change
          </h1>
          <p>
          Cap-Analytics is an initiative of Canet Consulting that empowers Zambian SMEs to become investment-ready 
            while equipping impact investors with ground-level intelligence. 
            We provide actionable ESG guidance, business profiling, and matchmaking tools to unlock sustainable capital flows in Zambia.
          </p>
          </div>  
        
         <div className=" border border-n-1/10 rounded-3xl overflow-hidden lg:p-5">
           <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="mt-4 text-lg font-bold">{post.title}</h2>
              <p className="text-sm text-gray-500">
                {post.author} - {post.publishDate}
              </p>
              <p className="mt-2 text-gray-700">{post.summary}</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Read More
              </button>
            </div>
          ))}
        </div>
      </section>
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
