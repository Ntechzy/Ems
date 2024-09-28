import mongoose from "mongoose"

const hardwareSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required"],
    },
    value: {
        type: String,
        required: [true , "Hardware value is Required"]
    },
    logo: {
        url: {
            type: String,
            required: [true, "Logo URL is required"],
        },
        client_id: {
            type: String,
            required: [true, "Client ID is required"],
        },
    },
});

const hardwareModel = (mongoose.models.Hardware) || mongoose.model("Hardware", hardwareSchema)
export default hardwareModel;