import mongoose, { Schema, Document, model, models } from 'mongoose';

// Define the interface for BoardMember document
export interface IBoardMember extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  positions: {
    company: string; // Company ID
    position: string; // Position in the company
  }[];
}

// Define the schema for Position
const PositionSchema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  position: { type: String, required: true },
}, {
  _id: false, // Avoid creating an _id for subdocuments
});

// Define the schema for BoardMember
const BoardMemberSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  positions: [PositionSchema], // Array of positions with company reference and position
}, {
  timestamps: true,
});

// Create and export the BoardMember model
const BoardMember = models.BoardMember || model<IBoardMember>('BoardMember', BoardMemberSchema);
export default BoardMember;
