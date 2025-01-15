import React from 'react';

interface CompanyInvestmentsProps {
  company: any;
}

const CompanyInvestments: React.FC<CompanyInvestmentsProps> = ({ company }) => {
  return (
    <div>
      <h2>Investments</h2>
      {/* Add investment details here */}
    </div>
  );
};

export default CompanyInvestments;
