import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: [true, "Please provide your query"],
        trim: true
    }

}, { timestamps: true });

const TicketModel = (mongoose.models.Ticket) || mongoose.model("Ticket", ticketSchema);

export default TicketModel;