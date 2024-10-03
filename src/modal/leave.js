import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    leaveType: {
        type: String,
        enum: ['absent', 'casual']
    },
    leaveFrom: {
        type: Date,
        required: [true, "Please provide from which date you want leave"]
    },
    leaveTo: {
        type: Date,
        required: [true, "Please provide upto which date you want leave"]
    },
    reason: {
        type: String,
        required: [true, "Reason for leave is required"]
    },
    whoApprovedLeave: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide who approved leave"]
    }

});


const Leave = (mongoose.models.Leave) || mongoose.model("Leave", leaveSchema);
export default Leave;