import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TypeScript interface for a Grant document
export interface IGrant extends Document {
  title: string;
  description: string;
  awardingOrg: string;
  orgURL: string;
  amount: string;
  eligibility: string;
  duration: string;
  expiredingDate: Date;
}

// Define the Mongoose schema
const GrantsSchema: Schema<IGrant> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    awardingOrg: { type: String, required: true },
    orgURL: { type: String, required: true },
    amount: { type: String, required: true },
    eligibility: { type: String, required: true },
    duration: { type: String, required: true },
    expiredingDate: { type: Date, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Export the model
const Grants: Model<IGrant> = mongoose.models.Grants || mongoose.model<IGrant>("Grants", GrantsSchema);

export default Grants;
