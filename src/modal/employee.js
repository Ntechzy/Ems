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
        required: [true, "alloted_hardwares is required"],
        ref: 'Hardware',
    }],
    alloted_softwares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Software',
        required: [true, "alloted_softwares is required"],
    }],
    interview_done_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Interview Done By is required "]
    },
    who_finalized_salary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Who finalized salary is required"]
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
    }],
    profile_photo: {
        client_id: String,
        cloud_url: String
    }
}, {
    timestamps: true
});

employeeSchema.path('alloted_hardwares').validate(function (value) {
    return value.length > 0;
}, 'At least one hardware must be allocated.');

employeeSchema.path('alloted_softwares').validate(function (value) {
    return value.length > 0;
}, 'At least one software must be allocated.');

employeeSchema.pre(/^find/, function (next) {
    this.populate('user_id');
    next();
});

const employeeModel = (mongoose.models.Emp) || mongoose.model("Emp", employeeSchema)
export default employeeModel; 