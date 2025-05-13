import { Schema, model, models, Document } from 'mongoose';

// TypeScript Interface for InvestmentAsk
export interface IInvestmentAsk extends Document {
  min: number;
  max: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema
const investmentAskSchema = new Schema<IInvestmentAsk>(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

// Mongoose Model
const InvestmentAsk = mongoose.models.InvestmentAsk || mongoose.model('InvestmentAsk', investmentAskSchema);

export default InvestmentAsk;
