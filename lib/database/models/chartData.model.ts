import mongoose, { Schema, models, model } from 'mongoose';

const chartDataSchema = new Schema({
  metadataId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartMetadata', required: true },
}, { strict: false });

const ChartData = models.ChartData || model('ChartData', chartDataSchema);

export default ChartData;
