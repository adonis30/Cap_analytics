import React from 'react';
import {
  MapPin, Users, Building2, Globe, User, Activity, Phone, Mail,
  DollarSign, Calendar, Briefcase, Hash, Building
} from 'lucide-react';

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
    fundingInstruments: Array<{ name: string }> | string[];
    categoryNames?: string[];
    fundedDate?: string | number | Date;
    sdgFocus?: Array<{ name: string }>;
    sector?: Array<{name: string }>;
  };
}

const CompanySummary: React.FC<CompanySummaryProps> = ({ company }) => {
  const InfoItem = ({
    icon: Icon,
    label,
    value
  }: {
    icon: any,
    label: string,
    value: string | React.ReactNode
  }) => (
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {company.organizationName || 'Company Name Not Available'}
          </h2>
          <p className="text-gray-600 text-lg">
            {company.description || 'No description available'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <InfoItem icon={MapPin} label="Location" value={company.location || 'Not specified'} />
            <InfoItem icon={Users} label="Employees" value={company.employeeCount || 'Not available'} />
            <InfoItem icon={Building2} label="Sector" value={company.sector?.map(cat => sec.name).join(', ') || 'Not specified'} />
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
            <InfoItem
              icon={Hash}
              label="SDG Focus"
              value={
                company.sdgFocus?.length
                  ? company.sdgFocus.map((sdg) => sdg.name).join(', ')
                  : 'Not specified'
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-blue-500" />
            Funding Instrument
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {company.fundingInstruments && company.fundingInstruments.length > 0 ? (
              company.fundingInstruments.map((stage, index) => (
                <li key={index} className="text-blue-600">
                  <span className="text-gray-600">
                    {typeof stage === 'string' ? stage : stage.name}
                  </span>
                </li>
              ))
            ) : (
              <li>No funding instrument available</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Company Details</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DetailSection title="Industries/ sector" content={
              company.categories && company.sector.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {company.sector.map((sectorg, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {sector.name}
                    </span>
                  ))}
                </div>
              ) : 'No industries specified'
            } />
            <DetailSection title="Headquarters" content={company.location || 'Not specified'} />
            <DetailSection title="Founders" content="N/A" />
            <DetailSection title="Last Funding Type" content="N/A" />
            <DetailSection title="Legal Name" content={company.organizationName || 'Not available'} />
            <DetailSection title="Diversity Spotlight" content={
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                N/A
              </span>
            } />
            <DetailSection title="Founded Date" content={
              company.fundedDate
                ? new Date(company.fundedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'Not available'
            } />
            <DetailSection title="Operating Status" content={company.operatingStatus || 'Not available'} />
            <DetailSection title="Also Known As" content={company.organizationName || 'Not available'} />
            <DetailSection title="Stock Symbol" content="N/A" />
            <DetailSection title="Company Type" content="For Profit" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailSection: React.FC<{ title: string; content: React.ReactNode }> = ({ title, content }) => (
  <div>
    <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
    <div className="text-base text-gray-900">{content}</div>
  </div>
);

export default CompanySummary;
