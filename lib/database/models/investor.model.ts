import mongoose, { Schema, Document, models, model } from 'mongoose';

// Define the interface for Investor document
export interface IInvestor extends Document {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  fundedCompaniesIds: string[];
  fundedRounds: string[];
  fundingTypes: string[];
  totalAmountFunded: number;
  highestAmountFunded: number;
}

// Define the schema for Investor
const investorSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  fundedCompaniesIds: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  fundedRounds: [{ type: Schema.Types.ObjectId, ref: 'FundingRound' }],
  fundingTypes: [{ type: Schema.Types.ObjectId, ref: 'FundingType' }],
  totalAmountFunded: { type: Number, default: 0 },
  highestAmountFunded: { type: Number, default: 0 },
});

// Create and export the Investor model
const Investor = models.investor || model<IInvestor>('Investor', investorSchema);
export default Investor;
