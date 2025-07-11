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
  buttonText: string;
};


const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "For SMEs",
    author: "",
    publishDate: "",
    category: "Market Trends",
    summary: "Raise capital. Improve visibility. Build sustainable business practices.",
    imageUrl: "/assets/images/test-2.png",
    buttonText: "Join Our SME Network",
  },
  {
    id: "2",
    title: "For Impact Investors",
    author: "",
    publishDate: "",
    category: "Investor Tips",
    summary: "Discover investable opportunities, backed by real-time insights and ESG alignment.",
    imageUrl: "/assets/images/hero2.jpg",
    buttonText: "View Investment Pipeline",
  },
  {
    id: "3",
    title: "For Ecosystem Partners",
    author: "",
    publishDate: "",
    category: "Market Trends",
    summary: "Get the latest trends and analytics on Investments and Macroeconomic performance.",
    imageUrl: "/assets/images/hero3.jpg",
    buttonText: "View Reports and Analytics",
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
            <h1 className="text-2xl text-center md:text-3xl font-bold text-gray-800">
           Who We Serve
          </h1>
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
            {post.buttonText}
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
