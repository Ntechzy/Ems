import mongoose from "mongoose";
import dbconn from "@/lib/dbconn";
import employeeModel from "@/modal/employee";
import { getServerSession } from "next-auth";
import { Option } from "../auth/[...nextauth]/option";
import dobModel from "@/modal/birthday";
import { encrypt } from "@/lib/encrypt";
import userModel from "@/modal/user";
import { date } from "yup";

export async function PUT(req) {
  console.log("PUT request received");

  await dbconn();
  const session = await getServerSession(Option);
  console.log(session.user);

  try {
    if (session && session.user) {
      const {
        permanent_address ,
        correspondence_address ,
        pan_card_no ,
        aadhaar_no ,
        father_name ,
        dob,
        date_of_joining,
        salary_slot ,
        blood_group ,
        marital_status ,
        highest_qualification ,
        account_holder_name , 
        bank_name ,       
        ifsc_code ,          
        account_number   
      } = await req.json();

      const encryptedPanCardNo = encrypt(pan_card_no);
      const encryptedAadhaarNo = encrypt(aadhaar_no);
      const encryptedAccountHolderName = encrypt(account_holder_name);
      const encryptedBankName = encrypt(bank_name);
      const encryptedIfscCode = encrypt(ifsc_code);
      const encryptedAccountNumber = encrypt(account_number);
    
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

    // const salary_date=new Date(Date.now(salary_slot))
    // const salary_date = new Date(salary_slot);
    // const day=salary_date.split('-')[0];


    const [day, month, year] = salary_slot.split('-').map(Number); // Split and convert to numbers

    // Create a new Date object (month is 0-indexed in JavaScript)
    const dateObject = new Date(year, month - 1, day);

    // Validate that the date is valid
    if (isNaN(dateObject.getTime())) {
        return res.status(400).json({ error: 'Invalid date' });
    }

    // Extract the day from the Date object
    const extractedDay = dateObject.getDate(); // This gets the day (1-31)

    console.log("extractedDay", extractedDay);


    console.log("salary date",day);
     
  //   const day  = salary_date.split('-')[2];
  //  console.log("day",day);
   
      const  id =session.user.id 
      console.log("user id",id);
      
      const updatedUser = await employeeModel.findOneAndUpdate(
        { user_id: id },
        {
          user_id: id,
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
          salary_slot:extractedDay ,
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
      console.log("updatedIt",updatedIt);
      
      if (!updatedUser) {
        return Response.json({
            success: false,
            message: "User not found",
          },
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return Response.json({
          success: true,
          user: updatedUser,
          message: "Details Updated Successfully",
        },
        {
          status: 200, 
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
    return Response.json({
        success: false,
        message: "Error While Updating the Details",
        error: error.message,
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
