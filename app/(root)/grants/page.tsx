"use client";

import { useState } from "react";
import { grants } from "@/lib/actions/grants.actions";
import type { GrantOpportunity } from "@/types/GrantOpportunity";

export default function GrantsPage() {
  const [selectedGrant, setSelectedGrant] = useState<GrantOpportunity | null>(null);

  return (
    <main className="px-4 py-10 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
        Grants & Technical Assistance Opportunities
      </h1>
      <p className="text-sm text-gray-600 mb-8">
        Explore current funding and support opportunities relevant to African innovation, development, and entrepreneurship.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {grants.map((grant) => (
          <div
            key={grant.id}
            className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 hover:border-blue-500 hover:shadow transition cursor-pointer"
            onClick={() => setSelectedGrant(grant)}
          >
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              {grant.title}
            </h2>
            <p className="text-sm text-gray-700 line-clamp-3">{grant.description}</p>
            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <p><strong>Organization:</strong> {grant.awardingOrganization}</p>
              <p><strong>Amount:</strong> {grant.amount}</p>
              <p><strong>Eligibility:</strong> {grant.eligibility}</p>
            </div>
          </div>
        ))}
      </div>

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
              <p><strong>Organization:</strong> {selectedGrant.awardingOrganization}</p>
              <p><strong>Amount:</strong> {selectedGrant.amount}</p>
              <p><strong>Eligibility:</strong> {selectedGrant.eligibility}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
