"use client";

export interface InvestorInvestmentsProps {
  investments: {
    companyName: string;
    investmentAmount: number;
    date: string;
  }[];
}

export default function InvestorInvestments({ investments }: InvestorInvestmentsProps) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Investments</h2>
      {investments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {investments.map((investment, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900">
                {investment.companyName}
              </h3>
              <p className="text-gray-700">Investment Amount: ${investment.investmentAmount.toLocaleString()}</p>
              <p className="text-gray-500">Date: {new Date(investment.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No investments listed.</p>
      )}
    </div>
  );
}
