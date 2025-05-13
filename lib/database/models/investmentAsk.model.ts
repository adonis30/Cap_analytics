import { Schema, model, models } from 'mongoose';

// TypeScript Interface for InvestmentAsk
export interface IInvestmentAsk extends Document {
  min: number;
  max: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema
const investmentAskSchema = new Schema(
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
const InvestmentAsk = models.InvestmentAsk || model('InvestmentAsk', investmentAskSchema);

export default InvestmentAsk;

 
