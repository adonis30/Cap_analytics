import { InstitutionInvestorProps } from "@/types";
import { Schema, models, model } from "mongoose";

const InstitutionInvestorSchema = new Schema<InstitutionInvestorProps>({
  type: { type: String, enum: ['Institution'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  totalAmountFunded: { type: Number, required: true },
  highestAmountFunded: { type: Number, required: true },
  fundingTypes: [{ type: Schema.Types.ObjectId, ref: 'FundingType' }],
  fundedCompaniesIds: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  institutionDetails: {
    organizationName: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    contactNumber: { type: String },
    address: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    contactEmail: { type: String },
    location: { type: String },
    imageUrl: { type: String, required: true },
  },
});

const InstitutionInvestor = models.InstitutionInvestor || model('InstitutionInvestor', InstitutionInvestorSchema);
export default InstitutionInvestor;