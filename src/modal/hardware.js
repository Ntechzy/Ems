import mongoose from "mongoose"

const hardwareSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required"],
    },
    logo: {
        type: Object,
        required: [true, "logo is Required"],
    },
});

const hardwareModel = (mongoose.model.Hardware) || mongoose.model("Hardware", hardwareSchema)
export default hardwareModel;