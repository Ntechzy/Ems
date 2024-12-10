import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: [true, "Creation date is required"]
    },
    company: {
        type: String,
        required: [true, "Company name is required"]
    },
    location: {
        type: String,
        required: [true, "Location is required"]
    }
}, { timestamps: true })

const expenseItemModel = (mongoose.models.Expenses) || mongoose.model("Expenses", expenseSchema);
export default expenseItemModel;