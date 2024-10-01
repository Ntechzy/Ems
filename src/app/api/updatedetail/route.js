import mongoose from "mongoose";
import dbconn from "@/lib/dbconn";
import employeeModel from "@/modal/employee";
import { getServerSession } from "next-auth";
import { Option } from "../auth/[...nextauth]/option";
import dobModel from "@/modal/birthday";

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
      } = await req.json();

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
      });

      // Convert date strings to Date objects
      // const dobDate = new Date(dob.split("/").join("-"));
      // const dateOfJoining = new Date(
      //   date_of_joining.split("/").join("-")
      // );
      console.log(session.user);

      const dob_id = await dobModel.create({
        name: session.user.username,
        date: dob,
      });

      const doj = new Date(Date.now(date_of_joining));
      console.log("doj", doj);

      // Update the user record 
      const  id =session.user.id 
      console.log(id);
      
      const updatedUser = await employeeModel.findOneAndUpdate(
        {user_id:id},
        {
          permanent_address,
          correspondence_address,
          pan_card_no,
          aadhaar_no,
          father_name,
          dob: dob_id,
          date_of_joining: doj,
          blood_group,
          marital_status,
          highest_qualification,
        },
        { new: true } // Return the updated document
      );
      console.log(updatedUser);
      
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
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please Login",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error while processing request:", error);
    return new Response(
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
