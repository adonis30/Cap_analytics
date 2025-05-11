import mongoose from "mongoose";

export interface ISector extends Document {
    _id: string;
    name: string;
    description: string;
}

const sectorSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
}, {
    timestamps: true,
});

const Sector = mongoose.models.Sector || mongoose.model('Sector', sectorSchema);

export default Sector;