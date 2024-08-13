import React from 'react';

interface CompanyPeopleProps {
  company: any;
}

const CompanyPeople: React.FC<CompanyPeopleProps> = ({ company }) => {
  return (
    <div>
      <h2>People</h2>
      {/* Add people details here */}
    </div>
  );
};

export default CompanyPeople;
