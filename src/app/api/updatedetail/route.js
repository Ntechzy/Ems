import mongoose from "mongoose";
import dbconn from "@/lib/dbconn";
import employeeModel from "@/modal/employee";
import { getServerSession } from "next-auth";
import { Option } from "../auth/[...nextauth]/option";
import dobModel from "@/modal/birthday";
import { encrypt } from "@/lib/encrypt";
import userModel from "@/modal/user";
import { date } from "yup";
import { uploadToCloudinary } from "../upload/route";
// import { getDataUri } from "@/lib/helper/dataUri";

export async function PUT(req) {
  console.log("PUT request received");
  await dbconn();
  const session = await getServerSession(Option);

  try {
    if (session && session.user && session.user.status) {
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
    if (session && session.user) {
      const formData = await req.formData();
      console.log([...formData.entries()]);
      const permanent_address = formData.get("permanent_address");
      const correspondence_address = formData.get("correspondence_address");
      const pan_card_no = formData.get("pan_card_no");
      const aadhaar_no = formData.get("aadhaar_no");
      const father_name = formData.get("father_name");
      const dob = formData.get("dob");
      const date_of_joining = formData.get("date_of_joining");
      const salary_slot = formData.get("salary_slot");
      const blood_group = formData.get("blood_group");
      const marital_status = formData.get("marital_status");
      const highest_qualification = formData.get("highest_qualification");
      const account_holder_name = formData.get("account_holder_name");
      const bank_name = formData.get("bank_name");
      const ifsc_code = formData.get("ifsc_code");
      const account_number = formData.get("account_number");
      const profile_photo = formData.get("profile_photo");

      // console.log(profile_photo);
      // let profilePhotoData = {};
      // console.log("okokok");

      // if (profile_photo && profile_photo.size > 0) {
      //   // Upload to Cloudinary
      //   console.log("File being uploaded hahahaah:", profile_photo);
        
      //   const uploadResult = await uploadToCloudinary(profile_photo, "ems");

      //   console.log(uploadResult, "uploadResult");

      //   // Store both client_id and cloud_url
      //   profilePhotoData = {
      //     client_id: uploadResult.public_id,
      //     cloud_url: uploadResult.secure_url,
      //   };

      //   console.log("profilePhotoData", profilePhotoData);
      // }
      // console.log("profilePhotoData", profilePhotoData);
      // console.log(client_id, cloud_url);



      let profilePhotoData = {};

      if (profile_photo && profile_photo.size > 0) {
        // Convert the file to a Data URI
        // const fileUri = await getDataUri(profile_photo);
        // console.log("File being uploaded:", fileUri);

        // Upload to Cloudinary
        const buffer = await profile_photo.arrayBuffer();
        const uploadResult = await uploadToCloudinary(Buffer.from(buffer), "ems");
        console.log(uploadResult, "uploadResult");

        // Store both client_id and cloud_url
        profilePhotoData = {
          client_id: uploadResult.public_id,
          cloud_url: uploadResult.url,
        };
      }
      console.log("profilePhotoData", profilePhotoData);




      const encryptedPanCardNo = encrypt(pan_card_no);
      const encryptedAadhaarNo = encrypt(aadhaar_no);
      const encryptedAccountHolderName = encrypt(account_holder_name);
      const encryptedBankName = encrypt(bank_name);
      const encryptedIfscCode = encrypt(ifsc_code);
      const encryptedAccountNumber = encrypt(account_number);

      // console.log(session.user);
      const dob_date = new Date(Date.now(dob));
      const dob_id = await dobModel.create({
        name: session.user.username,
        date: dob_date,
      });

      const doj = new Date(Date.now(date_of_joining));

      const salarySlotTrimmed = salary_slot.trim(); // Ensure no leading/trailing spaces
      console.log("Salary slot after trimming:", salarySlotTrimmed);

      const [day, month, year] = salarySlotTrimmed.split("-").map(Number); // Split and convert to numbers

      console.log(day, month, year);
      // Create a new Date object (month is 0-indexed in JavaScript)
      const dateObject = new Date(year, month - 1, day);

      // // Validate that the date is valid
      if (isNaN(dateObject.getTime())) {
        return new Response("Invalid date format", { status: 400 });
      }

      // // Extract the day from the Date object
      const extractedDay = dateObject.getDate(); // This gets the day (1-31)

      console.log("extractedDay", extractedDay);

      console.log("salary date", day);

      //   const day  = salary_date.split('-')[2];
      //  console.log("day",day);

      const id = session.user.id;
      console.log("user id", id);

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
          salary_slot: extractedDay,
          account_holder_name: encryptedAccountHolderName,
          bank_name: encryptedBankName,
          ifsc_code: encryptedIfscCode,
          account_number: encryptedAccountNumber,
          profile_photo: profilePhotoData,
        },
        { new: true }
      );
      const updatedIt = await userModel.findByIdAndUpdate(
        { _id: id },
        {
          isFormCompleted: true,
        },
        { new: true }
      );
      console.log("updatedIt", updatedIt);

      if (!updatedUser) {
        return Response.json(
          {
            success: false,
            message: "User not found",
          },
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return Response.json(
        JSON.stringify(
          {
            success: true,
            user: updatedUser,
            message: "Details Updated Successfully",
          },
          {
            status: 200,
          }
        )
      );
    } else {
      return (
        Response.json({
          success: false,
          message: "Please Login",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error while processing request:", error);
    return Response.json(
      {
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
