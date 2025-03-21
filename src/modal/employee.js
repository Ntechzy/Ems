import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   
    },
    permanent_address: {
      type: String,
      default: "",
      trim: true,
    },
    correspondence_address: {
      type: String,
      default: "",
      trim: true,
    },
    pan_card_no: {
      type: String,
      default: "",
      trim: true,
    },
    aadhaar_no: {
      type: String,
      default: "",
      trim: true,
    },
    father_name: {
      type: String,
      default: "",
      trim: true,
    },
    dob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DOB",
      default: null,
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
      default: "",
      trim: true,
    },
    marital_status: {
      type: String,
      default: "",
      trim: true,
    },
    highest_qualification: {
      type: String,
      default: "",
      trim: true,
    },
    alloted_hardwares: [{
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "alloted_hardwares is required"],
      ref: 'Hardware',
    }],
    alloted_softwares: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Softwares',
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
      type: Number, 
    },
    account_holder_name: {
      type: String,
      default: null
    },
    bank_name: {
      type: String,
      default: null,
      trim: true,
    },
    ifsc_code: {
      type: String,
      default: null,
      trim: true,
    },
    account_number: {
      type: String,
      default: null,
      trim: true,
    },
    monthy_percentage: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
    
    profile_photo: {
      client_id: {type: String},
      cloud_url: {type: String},
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




const employeeModel =
  mongoose.models.Emp || mongoose.model("Emp", employeeSchema);
export default employeeModel;
