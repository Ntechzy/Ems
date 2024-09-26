import mongoose from "mongoose";

const dobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },

});

const dobModel = (mongoose.models.DOB) || mongoose.model("DOB", dobSchema)
export default dobModel;