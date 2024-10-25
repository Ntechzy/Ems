import mongoose from "mongoose"
const extraLeaveSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const ExtraLeave = (mongoose.models.ExtraLeave) || mongoose.model("ExtraLeave", extraLeaveSchema)

export default ExtraLeave