import mongoose, { Schema } from "mongoose";

const employeeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permanent_address: {
        type: String,
        // required: true
        default: ""
    },
    correspondence_address: {
        type: String,
        // required: true
        default: ""
    },
    pan_card_no: {
        type: String,
        // required: true
        default: ""
    },
    aadhaar_no: {
        type: String,
        // required: true
        default: ""
    },
    father_name: {
        type: String,
        // required: true
        default: ""
    },
    dob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Birthday',
        // required: true
        default: null
    },
    date_of_joining: {
         type: Date, 
    },
    salary: {
        type: String,
        required: true,
    },
    blood_group: {
        type: String,
        // required: true
        default: ""
    },
    marital_status: {
        type: String,
        // required: true
        default: ""
    },
    highest_qualification: {
        type: String,
        // required: true
        default: ""
    },  
    alloted_hardwares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hardware'
    }],
    alloted_softwares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Software'
    }],
    interview_done_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    who_finalized_salary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    salary_slot: {
        type: Date,
        // required: true
        default: ""
    },
    monthy_percentage: {
        type: String,
        // required: true
        default: ""
    },
    status: {
        type: Boolean,
        default: true
    },
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    leaves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leave'
    }]
}, {
    timestamps: true
});

const employeeModel = (mongoose.models.Emp) || mongoose.model("Emp", employeeSchema)
export default employeeModel; 