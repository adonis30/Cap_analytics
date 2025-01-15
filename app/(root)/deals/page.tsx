import React from "react";

type Deal = {
  id: string;
  name: string;
  type: string;
  industry: string;
  amount: string;
  status: "Active" | "Completed";
  description: string;
};

const deals: Deal[] = [
  {
    id: "1",
    name: "TechWave Funding Round",
    type: "Seed",
    industry: "Technology",
    amount: "$1M",
    status: "Active",
    description: "Raising funds to expand AI-driven solutions.",
  },
  {
    id: "2",
    name: "EcoGrow Partnership",
    type: "Partnership",
    industry: "Agriculture",
    amount: "N/A",
    status: "Completed",
    description: "Partnership to innovate sustainable farming.",
  },
];

const Deals = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header className="bg-gray-50 text-gray-900 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Explore Investment Deals</h1>
          <p className="mt-2 text-lg">Find the right opportunities for your business or investment.</p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search deals..."
              className="px-4 py-2 rounded-md w-full md:w-1/3 border-black"
            />
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <section className="py-6 bg-gray-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            All Deals
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Active Deals
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Completed Deals
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Seed Funding
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Partnerships
          </button>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className={`p-6 border rounded-md ${
                deal.status === "Active" ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-300"
              }`}
            >
              <h2 className="text-xl font-semibold">{deal.name}</h2>
              <p className="text-sm text-gray-500">{deal.type} - {deal.industry}</p>
              <p className="mt-2 text-lg font-bold">{deal.amount}</p>
              <p className="mt-2 text-gray-700">{deal.description}</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                {deal.status === "Active" ? "Inquire Now" : "View Details"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <footer className="py-10 bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold">Got a Deal to Showcase?</h3>
          <p className="mt-2">Submit your deal and connect with investors today!</p>
          <button className="mt-4 px-6 py-3 bg-white text-blue-600 font-bold rounded-md hover:bg-gray-100">
            Submit a Deal
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Deals;
