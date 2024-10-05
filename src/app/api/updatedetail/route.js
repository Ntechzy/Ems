import mongoose from "mongoose";
import dbconn from "@/lib/dbconn";
import employeeModel from "@/modal/employee";
import { getServerSession } from "next-auth";
import { Option } from "../auth/[...nextauth]/option";
import dobModel from "@/modal/birthday";
import { encrypt } from "@/lib/encrypt";
import userModel from "@/modal/user";

export async function PUT(req) {
  console.log("PUT request received");

  await dbconn();
  const session = await getServerSession(Option);
  console.log(session.user);

  try {
    if (session && session.user) {
      const {
        permanent_address = "",
        correspondence_address = "",
        pan_card_no = "",
        aadhaar_no = "",
        father_name = "",
        dob,
        date_of_joining,

        blood_group = "",
        marital_status = "",
        highest_qualification = "",
        account_holder_name = "", 
        bank_name = "",       
        ifsc_code = "",          
        account_number = ""   
      } = await req.json();

      const encryptedPanCardNo = encrypt(pan_card_no);
      const encryptedAadhaarNo = encrypt(aadhaar_no);
      const encryptedAccountHolderName = encrypt(account_holder_name);
      const encryptedBankName = encrypt(bank_name);
      const encryptedIfscCode = encrypt(ifsc_code);
      const encryptedAccountNumber = encrypt(account_number);
      console.log("Encrypted Request data:", {
        permanent_address,
        correspondence_address,
        encryptedPanCardNo,
        encryptedAadhaarNo,
        encryptedAccountHolderName,
        encryptedBankName,
        encryptedIfscCode,
        encryptedAccountNumber,
      });
      console.log("Request data:", {
        permanent_address,
        correspondence_address,
        pan_card_no,
        aadhaar_no,
        father_name,
        dob,
        date_of_joining,
        blood_group,
        marital_status,
        highest_qualification,
        account_holder_name , 
        bank_name,           
        ifsc_code ,           
        account_number, 
      });

      // Convert date strings to Date objects
      // const dobDate = new Date(dob.split("/").join("-"));
      // const dateOfJoining = new Date(
      //   date_of_joining.split("/").join("-")
      // );
      console.log(session.user);
    const dob_date = new Date (Date.now(dob))
      const dob_id = await dobModel.create({
        name: session.user.username,
        date: dob_date,
      });

      const doj = new Date(Date.now(date_of_joining));
      console.log("doj", doj);

    
      const  id =session.user.id 
      console.log(id);
      
      const updatedUser = await employeeModel.findOneAndUpdate(
        { user_id: id },
        {
          permanent_address,
          correspondence_address,
          pan_card_no: encryptedPanCardNo,
          aadhaar_no: encryptedAadhaarNo,
          father_name,
          dob: dob_id,
          date_of_joining: doj,
          blood_group,
          marital_status,
          highest_qualification,
          account_holder_name: encryptedAccountHolderName,
          bank_name: encryptedBankName,
          ifsc_code: encryptedIfscCode,
          account_number: encryptedAccountNumber,
        },
        { new: true }
      );
      console.log(updatedUser);
      const updatedIt = await userModel.findByIdAndUpdate(
        { _id: id }, 
        {
          isFormCompleted: true 
        },
        { new: true } 
      );
      console.log(updatedIt);
      
      if (!updatedUser) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User not found",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: updatedUser,
          message: "Details Updated Successfully",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Please Login",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      
    }
  } catch (error) {
    console.error("Error while processing request:", error);
    return Response(
      JSON.stringify({
        success: false,
        message: "Error While Updating the Details",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
