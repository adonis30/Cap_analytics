import mongoose, { Schema, models, model } from 'mongoose';

const ChartMetadataSchema = new Schema({
  title: { type: String, required: true },
  sheetName: { type: String },
  sourceFileName: { type: String },
  uploadedAt: { type: Date, default: Date.now },

  category: {
    type: String,
    enum: ["Macroeconomic Overview", "Business Climate", "Investment Trends"],
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  chartType: {
    type: String,
    enum: ["line", "bar", "pie", "area", "combo"],
    default: "line",
  },

  chartSubtype: {
    type: String,
    enum: [
      'default',
      'monotone', 'step', 'spline', 'stepped',
      'grouped', 'stacked', 'horizontal', 'percent',
      'stacked_area', 'percentage_area',
      'donut',
      'line-bar', 'area-bar', 'multi-axis',
    ],
    default: 'default',
  },

  yKeys: {
    type: [String],
    default: [],
  },

  xKey: {
    type: String,
    default: 'x',
  },

}, { timestamps: true });

// ✅ This line prevents OverwriteModelError
const ChartMetadata = models.ChartMetadata || model("ChartMetadata", ChartMetadataSchema);

export default ChartMetadata;
