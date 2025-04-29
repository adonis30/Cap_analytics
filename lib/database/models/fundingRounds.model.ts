import mongoose, { Schema } from "mongoose";


export interface IFundingRounds extends Document {
    _id: string;
    name: string;
    description: string;

}

const fundingRoundsSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
}, {
    timestamps: true,
});

const FundingRounds = mongoose.models.FundingRounds || mongoose.model('FundingRounds', fundingRoundsSchema);

export default FundingRounds;