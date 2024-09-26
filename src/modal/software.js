import mongoose from "mongoose"

const softwareSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required"],
    },
    logo: {
        type: Object,
        required: [true, "logo is Required"],
    },
});

const softwareModel = (mongoose.model.Softwares) || mongoose.model("Softwares", softwareSchema)
export default softwareModel;