import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
   id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   }
}, { timestamps: true });

// Create the model
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
