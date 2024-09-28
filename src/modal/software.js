import mongoose from "mongoose"

const softwareSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required"],
    },
    version: {
        type: String,
        required: [true , "Software version is Required"]
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

const softwareModel = (mongoose.models.Softwares) || mongoose.model("Softwares", softwareSchema)
export default softwareModel;