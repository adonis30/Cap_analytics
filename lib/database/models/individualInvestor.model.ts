import { IndividualInvestorProps } from "@/types";
import { Schema, models, model } from "mongoose";

const IndividualInvestorSchema = new Schema<IndividualInvestorProps>({
  type: { type: String, enum: ['Individual'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  totalAmountFunded: { type: Number, required: true },
  highestAmountFunded: { type: Number, required: true },
  fundingTypes: [{ type: Schema.Types.ObjectId, ref: 'FundingType' }],
  fundedCompaniesIds: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  individualDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    position: { type: String },
    linkedInUrl: { type: String },
    portfolioUrl: { type: String },
    imageUrl: { type: String, required: true },
    bio: { type: String },
  },
});

const IndividualInvestor = models.IndividualInvestor || model('IndividualInvestor', IndividualInvestorSchema);
export default IndividualInvestor;