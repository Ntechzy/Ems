import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    month: {
        type: String,
        required: [true, "Month is required"],
    },
    casualDays: {
        type: Number,
        enum: [0, 1],
        default: 0,
    },
    absentDays: {
        type: Number,
        default: 0,
    },
    leaveDetails: [{
        leaveType: {
            type: String,
            enum: ['absent', 'casual', 'sick'],
            required: [true, "Leave type is required"]
        },
        leaveFrom: {
            type: Date,
            required: [true, "Please provide from which date you want leave"]
        },
        leaveTo: {
            type: Date,
            required: [true, "Please provide up to which date you want leave"]
        },
        reason: {
            type: String,
            required: [true, "Reason for leave is required"]
        },
        RequestedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide who approved leave"]
        },
        isApproved: {
            type: Boolean,
            enum: [true, false, null],
            default: null
        }
    }]
}, { timestamps: true });


const Leave = (mongoose.models.Leave) || mongoose.model("Leave", leaveSchema);
export default Leave;