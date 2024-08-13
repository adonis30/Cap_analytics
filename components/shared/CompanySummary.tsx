import React from 'react';
import { MapPin, Users, Building2, Globe, User, Activity, Phone, Mail, DollarSign, Calendar, Briefcase, Hash, Building } from 'lucide-react';

interface CompanySummaryProps {
  company: {
    organizationName: string;
    description: string;
    location: string;
    employeeCount: string;
    categories?: Array<{ name: string }>;
    owners?: string;
    operatingStatus?: string;
    contactNumber?: string;
    contactEmail?: string;
    url: string;
    fundingTypes: Array<{ name: string }> | string[];
    categoryNames?: string[];
  };
}

const CompanySummary: React.FC<CompanySummaryProps> = ({ company }) => {
  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | React.ReactNode }) => (
    <div className="flex items-center py-2 border-b border-gray-200 last:border-b-0">
      <Icon className="w-5 h-5 mr-3 text-blue-500" />
      <span className="font-medium text-gray-700 mr-2">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{company.organizationName || 'Company Name Not Available'}</h2>
          <p className="text-gray-600 text-lg">{company.description || 'No description available'}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <InfoItem icon={MapPin} label="Location" value={company.location || 'Not specified'} />
            <InfoItem icon={Users} label="Employees" value={company.employeeCount || 'Not available'} />
            <InfoItem icon={Building2} label="Categories" value={company.categoryNames?.join(', ') || 'Not specified'} />
            <InfoItem 
              icon={Globe} 
              label="Website" 
              value={company.url ? (
                <a href={company.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {company.url}
                </a>
              ) : 'Not available'}
            />
          </div>
          
          <div className="space-y-3">
            <InfoItem icon={User} label="Owners" value={company.owners || 'Not specified'} />
            <InfoItem icon={Activity} label="Operating Status" value={company.operatingStatus || 'Not specified'} />
            <InfoItem icon={Phone} label="Phone" value={company.contactNumber || 'Not available'} />
            <InfoItem icon={Mail} label="Email" value={company.contactEmail || 'Not available'} />
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-blue-500" />
            Funding Types
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {company.fundingTypes && company.fundingTypes.length > 0 ? (
              company.fundingTypes.map((stage, index) => (
                <li key={index} className="text-blue-600">
                  <span className="text-gray-600">{typeof stage === 'string' ? stage : stage.name}</span>
                </li>
              ))
            ) : (
              <li>No funding types available</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Industries</h4>
            <div className="flex flex-wrap gap-2">
              {['Banking', 'Credit Cards', 'Financial Services', 'Wealth Management'].map((industry, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {industry}
                </span>
              ))}
            </div>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Headquarters Regions</h4>
            <p className="text-gray-600">Greater New York Area, East Coast, Northeastern US</p>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Founders</h4>
            <p className="text-gray-600">Harte Thompson, Rohit Mathur, Sanford Weill</p>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Last Funding Type</h4>
            <p className="text-gray-600">Post-IPO Equity</p>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Legal Name</h4>
            <p className="text-gray-600">Penta Parent Holdings, LP</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Diversity Spotlight</h4>
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
              Women Led
            </span>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Founded Date</h4>
            <p className="text-gray-600">Jun 16, 1812</p>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Operating Status</h4>
            <p className="text-gray-600">Active</p>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Also Known As</h4>
            <p className="text-gray-600">Citigroup.com</p>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Related Hubs</h4>
            <p className="text-gray-600">Citi Alumni Founded Companies, Citi Portfolio Companies</p>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Stock Symbol</h4>
            <p className="text-gray-600">NYSE:C</p>

            <h4 className="font-semibold text-gray-700 mt-4 mb-2">Company Type</h4>
            <p className="text-gray-600">For Profit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySummary;