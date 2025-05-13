import { Schema, model, models } from 'mongoose';

// TypeScript Interface for TicketSize
export interface ITicketSize extends Document {
  min: number;
  max: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema
const ticketSizeSchema = new Schema(
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
const TicketSize = models.TicketSize || model('TicketSize', ticketSizeSchema);

export default TicketSize;