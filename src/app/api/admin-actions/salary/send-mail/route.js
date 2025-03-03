import { isUserAuthenticated } from "@/lib/helper/ValidateUser";
import { sendSlip } from "@/lib/resend";
import userModel from "@/modal/user";


export async function POST(req, res) {
    try {
        const isAuthenticated = await isUserAuthenticated(req, res);
        if (!isAuthenticated || (isAuthenticated.role !== "admin" && isAuthenticated.role !== "super_admin")) {
            return Response.json({
                success: false,
                message: "You are not authorized to perform this action"
            }, { status: 403 });
        }

        const { data } = await req.json();


        const user = await userModel.findById(data.employeeId)


        if (!user) {
            return Response.json({
                success: false,
                message: "You are not authorized to perform this action"
            }, { status: 403 })
        }
        const emailRes = await sendSlip({
            name: data.name,
            month: data.month,
            baseSalary: data.baseSalary,
            totalAbsentDays: data.totalAbsentDays,
            extraDeductionAmount: data.extraDeductionAmount,
            salary: data.salary,
            reason: data.reason,
            employeeEmail: user.email
        });


        if (!emailRes.success) {
            return Response.json(
                {
                    success: false,
                    message: emailRes.message
                },
                {
                    status: 400,
                }
            );
        }

        return Response.json({
            sucess: true,
            message: "Reset Mail Sent Sucessfully"
        }, { status: 200 })
    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Something Went Wrong",
            error: error
        }, { status: 500 });
    }
} 