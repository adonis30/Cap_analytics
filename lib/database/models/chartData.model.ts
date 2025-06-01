import mongoose from 'mongoose';

const chartDataSchema = new mongoose.Schema({
  metadataId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartMetadata', required: true },
  // dynamic structure, allow any fields
}, { strict: false });

export default mongoose.model('ChartData', chartDataSchema);
