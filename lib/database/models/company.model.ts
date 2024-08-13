import { Document, Schema, model, models } from "mongoose";

export interface ICompany extends Document {
  _id: string;
  organizationName: string;
  description?: string;
  industries?: string;
  owners?: string;
  rankCompany?: string;
  operatingStatus?: string;
  contactNumber?: string;
  contactEmail?: string;
  numberOfSubOrgs?: string;
  location?: string;
  imageUrl: string;
  fundedDate?: Date;
  url?: string;
  categories: string[]; // Array of category IDs
  people: string[]; // Array of people IDs
  fundedBy: string[]; // Array of fundedBy IDs
  fundingTypes: string[]; // Array of fundingTypes IDs
  companyCreator?: { 
    _id: Schema.Types.ObjectId | string, 
    firstName?: string, 
    lastName?: string 
  };
  category?: {
    name: string;
  };
}

const CompanySchema = new Schema({
  organizationName: { type: String, required: true },
  description: { type: String },
  industries: { type: String },
  owners: { type: String },
  rankCompany: { type: String },
  operatingStatus: { type: String },
  contactNumber: { type: String },
  contactEmail: { type: String },
  numberOfSubOrgs: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  fundedDate: { type: Date, default: Date.now },
  url: { type: String },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  people: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  fundedBy: [{ type: Schema.Types.ObjectId, ref: 'FundingSource' }],
  fundingTypes: [{ type: Schema.Types.ObjectId, ref: 'FundingType' }],
  companyCreator: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Company = models.Company || model('Company', CompanySchema);

export default Company;