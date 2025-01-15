import React from 'react';

interface CompanyTechnologyProps {
  company: any;
}

const CompanyTechnology: React.FC<CompanyTechnologyProps> = ({ company }) => {
  return (
    <div>
      <h2>Technology</h2>
      {/* Add technology details here */}
    </div>
  );
};

export default CompanyTechnology;
