import mongoose, { Schema } from "mongoose";


export interface IFundingInstruments extends Document {
    _id: string;
    name: string;
    description: string;
    
}

const fundingInstrumentsSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
}, {
    timestamps: true,
});

const FundingInstruments = mongoose.models.FundingInstruments || mongoose.model('FundingInstruments', fundingInstrumentsSchema);

export default FundingInstruments;