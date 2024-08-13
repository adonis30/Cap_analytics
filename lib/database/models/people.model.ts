import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IPerson extends Document {
  _id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: string[];
  organizationId: mongoose.Types.ObjectId;
  position: string;
}

const PersonSchema: Schema = new Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumbers: { type: [String], required: true },
  organizationId: { type: mongoose.Types.ObjectId, ref: 'Organization', required: true },
  position: { type: String, required: true },
}, {
  timestamps: true,
});

const Person = models.Person || model<IPerson>('Person', PersonSchema);

export default Person;
