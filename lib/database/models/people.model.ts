import mongoose, { Schema, Document, model, models } from 'mongoose';

// Define the interface for Employee document
export interface IEmployee extends Document {
  _id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: string[];
  organizationId: mongoose.Types.ObjectId;
  position: string;
  department?: string; // Optional department field
  hireDate?: Date; // Optional hire date
  address?: string; // Optional address field
  linkedInUrl?: string; // Optional LinkedIn URL
  photoUrl?: string; // Optional photo URL
  bio?: string; // Optional short biography
}

// Define the schema for Employee
const employeeSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumbers: { type: [String], required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  position: { type: String, required: true },
  department: { type: String }, // Optional department
  hireDate: { type: Date }, // Optional hire date
  address: { type: String }, // Optional address
  linkedInUrl: { type: String }, // Optional LinkedIn URL
  photoUrl: { type: String }, // Optional photo URL
  bio: { type: String }, // Optional biography
}, {
  timestamps: true,
});

// Create and export the Employee model
const Employee = models.Employee || model<IEmployee>('Employee', employeeSchema);
export default Employee;
