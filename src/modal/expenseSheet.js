import mongoose from "mongoose";

const expenseSheetSchema = new mongoose.Schema(
    {
        expenses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Expenses",
                required: true,
            }
        ],
        month: {
            type: String,
            required: [true, "Month is required"]
        },
        amount: {
            type: Number,
            required: true
        },
        remaining: {
            type: Number,
            required: true
        }
    }, { timestamps: true })

const expenseSheetModel = (mongoose.models.expenseSheet) || mongoose.model("expenseSheet", expenseSheetSchema);
export default expenseSheetModel;