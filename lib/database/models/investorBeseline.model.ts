import { BaseInvestorProps } from "@/types";
import { Schema, models, model } from "mongoose";

const InvestorSchema = new Schema<BaseInvestorProps>({
  type: { type: String, enum: ['Individual', 'Institution'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  totalAmountFunded: { type: Number, required: true },
  highestAmountFunded: { type: Number, required: true },
  fundingTypes: [{ type: Schema.Types.ObjectId, ref: 'FundingType' }],
  fundedCompaniesIds: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
});

const Investor = models.Investor || model('Investor', InvestorSchema);
export default Investor;