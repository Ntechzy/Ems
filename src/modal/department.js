import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Department name is required"],
        trim: true
    },
    designations: [
        {
            name: String,
        }
    ],
    manager: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]
});

const Department = (mongoose.models.Department) || mongoose.model("Department", departmentSchema);

export default Department;