import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IFundingType extends Document {
  _id: string;
  name: string;
  description: string;
}

const fundingTypeSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
}, {
  timestamps: true,
});


const FundingType = mongoose.models.FundingType || mongoose.model('FundingType', fundingTypeSchema);

export default FundingType;