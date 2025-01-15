import React from "react";

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

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header className="bg-gray-50 text-gray-900 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Our Blog</h1>
          <p className="mt-2 text-lg">Insights, tips, and stories for businesses and investors.</p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search articles..."
              className="px-4 py-2 rounded-md w-full md:w-1/3"
            />
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section className="py-6 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            All Categories
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Business Insights
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Investor Tips
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Market Trends
          </button>
        </div>
      </section>

      {/* Blog Posts Section */}
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

      {/* Pagination Section */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 flex justify-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Load More
          </button>
        </div>
      </section>
    </div>
  );
};

export default Blog;
