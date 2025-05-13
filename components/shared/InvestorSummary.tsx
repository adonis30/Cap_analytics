import React from 'react';
import { MapPin, User, DollarSign, Phone, Mail, Calendar } from 'lucide-react';

interface InvestorSummaryProps {
  investor: {
    name: string;
    location: string;
    type: 'Individual' | 'Institution';
    contactNumber?: string;
    contactEmail?: string;
    totalAmountFunded?: string;
    highestAmountFunded?: string;
    foundedDate?: string | number | Date;
    fundedCompanies?: Array<{ name: string }>;
    investments?: string[];
    institutionDetails?: {
      description: string;
    };
    individualDetails?: {
      bio: string;
    };
  };
}

const InvestorSummary: React.FC<InvestorSummaryProps> = ({ investor }) => {
  const description =
    investor.type === 'Institution'
      ? investor.institutionDetails?.description
      : undefined;

  const bio =
    investor.type === 'Individual'
      ? investor.individualDetails?.bio
      : undefined;

  const summary = description || bio || 'No description or bio available';

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | React.ReactNode }) => (
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{investor.name || 'Investor Name Not Available'}</h2>
          <p className="text-gray-600 text-lg">{/*{summary} */}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <InfoItem icon={MapPin} label="Location" value={investor.location || 'Not specified'} />
            <InfoItem icon={User} label="Type" value={investor.type || 'Not specified'} />
            <InfoItem icon={DollarSign} label="Total Funded" value={investor.totalAmountFunded || 'Not available'} />
            <InfoItem
              icon={Calendar}
              label="Founded Date"
              value={
                investor.foundedDate
                  ? new Date(investor.foundedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Not available'
              }
            />
          </div>

          <div className="space-y-3">
            <InfoItem icon={Phone} label="Phone" value={investor.contactNumber || 'Not available'} />
            <InfoItem icon={Mail} label="Email" value={investor.contactEmail || 'Not available'} />
            <InfoItem icon={DollarSign} label="Highest Amount Funded" value={investor.highestAmountFunded || 'Not available'} />
            <InfoItem
              icon={DollarSign}
              label="Investments"
              value={investor.investments && investor.investments.length > 0 ? investor.investments.join(', ') : 'No investments available'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorSummary;
