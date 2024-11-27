"use client";

import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2"; // React wrapper for Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LineElement, PointElement, LinearScale, BarElement, Title, ArcElement, Tooltip);

const Reports = () => {
  // Sample Data for Charts
  const barChartData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Investments ($)",
        data: [5000, 7000, 8000, 9000, 12000],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const pieChartData = {
    labels: ["Technology", "Healthcare", "Finance", "Real Estate"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
      },
    ],
  };

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "ROI (%)",
        data: [10, 15, 20, 25],
        borderColor: "#3b82f6",
        fill: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-50 text-gray-900 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Reports & Analytics</h1>
          <p className="mt-2 text-lg">
            Visualize key metrics and trends for your business and investments.
          </p>
        </div>
      </header>

      {/* Filters */}
      <section className="py-4 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center gap-4">
          <label className="flex flex-col">
            <span className="text-gray-700">Date Range</span>
            <input
              type="date"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-700">Category</span>
            <select className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300">
              <option>All Categories</option>
              <option>Technology</option>
              <option>Healthcare</option>
              <option>Finance</option>
            </select>
          </label>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Apply Filters
          </button>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">Monthly Investments</h2>
            <Bar data={barChartData} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">Investment by Sector</h2>
            <Pie data={pieChartData} />
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">Weekly ROI</h2>
            <Line data={lineChartData} />
          </div>
        </div>
      </section>

      {/* Widgets */}
      <section className="py-10 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-md shadow-md">
            <h3 className="text-2xl font-bold">$50,000</h3>
            <p>Total Investments</p>
          </div>
          <div className="p-4 bg-green-100 text-green-600 rounded-md shadow-md">
            <h3 className="text-2xl font-bold">20%</h3>
            <p>Average ROI</p>
          </div>
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-md shadow-md">
            <h3 className="text-2xl font-bold">150</h3>
            <p>Active Businesses</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
