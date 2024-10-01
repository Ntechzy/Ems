import mongoose from "mongoose";
import dbconn from "@/lib/dbconn";
import employeeModel from "@/modal/employee";
import { getServerSession } from "next-auth";
import { Option } from "../auth/[...nextauth]/option";

export async function PUT(req) {
  console.log("PUT request received");

  await dbconn();

  // Get session and handle potential null case

  try {
    const session = await getServerSession(Option);
    console.log(session);
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          msg: "non o",
        },
        {
          status: 400,
        }
      );
    } else {
      return new Response.json(
        {
          success: false,
          msg: "yes yes ",
        },
        {
          status: 200,
        }
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
