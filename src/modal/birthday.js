import mongoose from "mongoose";

const dobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    }

});

const dobModel = (mongoose.models.DOB) || mongoose.model("DOB", dobSchema)
export default dobModel;