"use client";

import { useState, useEffect } from "react";
import type { GrantOpportunity } from "@/types/GrantOpportunity";

export default function GrantsPage() {
  const [grants, setGrants] = useState<GrantOpportunity[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<GrantOpportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchGrants = async () => {
    try {
      const res = await fetch("/api/grants");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : [];

      setGrants(data);
    } catch (error) {
      console.error("Failed to fetch grants:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchGrants();
}, []);

  return (
    <main className="min-h-screen px-4 py-10 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
        Grants & Technical Assistance Opportunities
      </h1>
      <p className="text-sm text-gray-600 mb-8">
        Explore current funding and support opportunities relevant to African innovation, development, and entrepreneurship.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading grants...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {grants.map((grant) => (
            <div
              key={grant._id}
              className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 hover:border-blue-500 hover:shadow transition cursor-pointer"
              onClick={() => setSelectedGrant(grant)}
            >
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                {grant.title}
              </h2>
              <p className="text-sm text-gray-700 line-clamp-3">{grant.description}</p>
              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <p><strong>Organization:</strong> {grant.awardingOrg}</p>
                <p><strong>Amount:</strong> ${grant.amount}</p>
                <p><strong>Eligibility:</strong> {grant.eligibility}</p>
                <p><strong>Expires On</strong> {grant.expiredingDate instanceof Date ? grant.expiredingDate.toLocaleDateString() : String(grant.expiredingDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGrant && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-xl relative">
            <button
              onClick={() => setSelectedGrant(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-xl font-bold text-blue-900 mb-2">
              {selectedGrant.title}
            </h2>
            <p className="text-gray-700 mb-4">{selectedGrant.description}</p>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Organization:</strong> {selectedGrant.awardingOrg}</p>
              <p><strong>Amount:</strong> ${selectedGrant.amount}</p>
              <p><strong>Expires On</strong> {selectedGrant.expiredingDate instanceof Date ? selectedGrant.expiredingDate.toLocaleDateString() : String(selectedGrant.expiredingDate)}</p>
              <p><strong>Eligibility:</strong> {selectedGrant.eligibility}</p>
              <p><strong>Grant Url:</strong>{selectedGrant.orgURL}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
