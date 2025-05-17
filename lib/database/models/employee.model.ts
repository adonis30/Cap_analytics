// models/employee.model.ts
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const employeeSchema = new Schema(
  {
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    phoneNumbers: { type: String, required: true },

    // Polymorphic reference fields
    organizationId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    organizationType: {
      type: String,
      required: true,
      enum: ['Company', 'Investor'],
    },

    position: { type: String, required: true },
    department: { type: String },
    hireDate: { type: Date, default: Date.now },
    address: { type: String },
    linkedInUrl: {
      type: String,
      match: /^https:\/\/(www\.)?linkedin\.com\/.*$/,
    },
    photoUrl: { type: String },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);


// Optional: validation to ensure proper reference
employeeSchema.pre('save', function (next) {
  if (!this.organizationId || !this.organizationType) {
    return next(new Error('Both organizationId and organizationType are required.'));
  }
  next();
});

const Employee = models.Employee || model('Employee', employeeSchema);

export default Employee;