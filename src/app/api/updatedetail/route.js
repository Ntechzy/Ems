import dbconn from "@/lib/dbconn";
import { encrypt } from "@/lib/encrypt";
import dobModel from "@/modal/birthday";
import employeeModel from "@/modal/employee";
import userModel from "@/modal/user";
import { getServerSession } from "next-auth";
import { Option } from "../auth/[...nextauth]/option";
import { uploadToCloudinary } from "@/lib/helper/upload";
import { date } from "yup";

export async function PUT(req) {
  await dbconn();
  const session = await getServerSession(Option);

  try {

    if (session && session.user && session.user.status) {
      const formData = await req.formData();

      const permanent_address = formData.get("permanent_address").trim();
      const correspondence_address = formData.get("correspondence_address").trim();
      const pan_card_no = formData.get("pan_card_no").trim();
      const aadhaar_no = formData.get("aadhaar_no").trim();
      const father_name = formData.get("father_name").trim();
      const dob = formData.get("dob").trim();
      const date_of_joining = formData.get("date_of_joining").trim();
      const salary_slot = formData.get("salary_slot").trim();
      const blood_group = formData.get("blood_group").trim();
      const marital_status = formData.get("marital_status").trim();
      const highest_qualification = formData.get("highest_qualification").trim();
      const account_holder_name = formData.get("account_holder_name").trim();
      const bank_name = formData.get("bank_name").trim();
      const ifsc_code = formData.get("ifsc_code").trim();
      const account_number = formData.get("account_number").trim();
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

        const buffer = await profile_photo.arrayBuffer();
        const uploadResult = await uploadToCloudinary(Buffer.from(buffer), "ems");
        console.log(uploadResult, "uploadResult");

        // Store both client_id and cloud_url
        profilePhotoData = {
          client_id: uploadResult.public_id,
          cloud_url: uploadResult.url,
        };
      }



      const encryptedPanCardNo = encrypt(pan_card_no);
      const encryptedAadhaarNo = encrypt(aadhaar_no);
      const encryptedAccountHolderName = encrypt(account_holder_name);
      const encryptedBankName = encrypt(bank_name);
      const encryptedIfscCode = encrypt(ifsc_code);
      const encryptedAccountNumber = encrypt(account_number);

      // console.log(session.user);
      const dob_date = new Date(dob);
      const dob_id = await dobModel.create({
        name: session.user.username,
        date: dob_date,
      });

      const doj = new Date(date_of_joining).getDate();



      // console.log("salary_slot", new Date(salary_slot).getDate());

      // const salarySlotTrimmed = salary_slot.trim();

      // const [day, month, year] = salarySlotTrimmed.split("-").map(Number); // Split and convert to numbers

      // console.log(day, month, year);
      // const dateObject = new Date(Date.now(year, month - 1, day));
      // console.log("dateObject", dateObject);

      // if (isNaN(dateObject.getTime())) {
      //   return new Response("Invalid date format", { status: 400 });
      // }

      const extractedDay = new Date(salary_slot).getDate();

      const id = session.user.id;

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
        {
          success: true,
          user: updatedUser,
          message: "Details Updated Successfully",
        },
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
        },
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
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
