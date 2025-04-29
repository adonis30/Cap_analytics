import mongoose, { Schema } from 'mongoose';

export interface ISdgFocus extends Document {
  name: string;
  description?: string;
}

const SdgFocusSchema = new Schema<ISdgFocus>({
  name: { type: String, required: true },
  description: { type: String, required: false },
}, {
  timestamps: true,
});

const SdgFocus = mongoose.models.SdgFocus || mongoose.model('SdgFocus', SdgFocusSchema);

export default SdgFocus;
