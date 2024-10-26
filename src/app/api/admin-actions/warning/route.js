import dbconn from "@/lib/dbconn";
import { isUserAuthenticated } from "@/lib/helper/ValidateUser";
import { WarningMail } from "@/lib/resend";
import userModel from "@/modal/user";

export async function POST(req, res) {
  await dbconn();
  try {
    const isAutherized = await isUserAuthenticated(req, res);

    if (!isAutherized.role === "user") {
      return Response.json(
        {
          sucess: false,
          message: "You are not authorized to perform this action",
        },
        { status: 400 }
      );
    }

    const { userId, warningMessage } = await req.json();
    console.log(userId);
    
    const user = await userModel.findById(userId);
    console.log(user);
    
    const isFormFilled = await isAutherized.isFormCompleted;
    if (!isFormFilled) {
      return Response.json(
        {
          sucess: false,
          message: "User not authenticated",
        },
        { status: 400 }
      );
    }

    console.log("message",user.email);
    const message= await WarningMail(warningMessage, user.email);
    
     if(!message.sucess){
        return Response.json(
            {
              sucess: true,
              message: "Warning not sent",
            },
            { status: 400 }
          );
     }
    return Response.json(
      {
        sucess: true,
        message: "Warning sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        sucess: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
