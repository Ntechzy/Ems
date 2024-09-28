import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema({
    accountHolder:{
        type:String,
        required:[true,"Account Holder Name is Required"]
    },
    bankName:{
        type:String,
        required:[true , "Bank Name is Required"]
    },
    ifscCode:{
        type:String,
        required:[true,"IFSC Code is Required"]
    },
    accountNumber:{
        type:String,
        required:[true,"Account Number is Required"]
    }
});

const BankDetails  = (mongoose.models.BankDetails) || mongoose.model("BankDetails",bankDetailsSchema);
export default BankDetails;