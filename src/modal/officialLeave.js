import { Schema, model } from 'mongoose';

const officialLeaveSchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OfficialLeave = (mongoose.models.OfficialLeave) || mongoose.model("OfficialLeave", officialLeaveSchema);
export default OfficialLeave;


