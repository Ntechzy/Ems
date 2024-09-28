import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    message:{
        type:String,
        required:[true , "Please provide your query"],
        trim:true
    }
});

const TicketModel = (mongoose.models.Ticket) || mongoose.model("Ticket" , ticketSchema);

export default TicketModel;