import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    employee_id: {
        type: String,
        required: [true, "employee_id is required"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    mobile_no: {
        type: String,
        required: [true, "mobile_no is required"],
        match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"]
    },
    associated_with: {
        type: String,
        required: [true, "Company providing employment is required"],
    },
    role: {
        type: String,
        enum: ["user", "admin", "super_admin"],
        default: "user",
    },
    designation: {
        type: String,
        required: [true, "designation is required"],
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Departments"
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    } else {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


const userModel = (mongoose.models.User) || mongoose.model("User", userSchema)
export default userModel;