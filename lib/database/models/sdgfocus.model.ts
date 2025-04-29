import mongoose from "mongoose";


export interface ISDGFocus extends Document {
    _id: string;
    name: string;
    description: string;
}

const sdgFocusSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
}, {
    timestamps: true,
});

const SDGFocus = mongoose.models.SDGFocus || mongoose.model('SDGFocus', sdgFocusSchema);

export default SDGFocus;