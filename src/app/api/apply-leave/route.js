import dbconn from "@/lib/dbconn";
import { isUserAuthenticated } from "@/lib/helper/ValidateUser";
import employeeModel from "@/modal/employee";
import Leave from "@/modal/leave";
import userModel from "@/modal/user";
import { leaveMail } from "@/lib/resend";

export async function POST(req, res) {
    await dbconn()
    try {
        const user = await isUserAuthenticated(req, res)
        console.log(user);

        const { leaveType, managerToAsk,
            startDate, endDate, reason } = await req.json()

        const employee = await employeeModel.findOne({ user_id: user.id })

        if (!employee) {
            return Response.json({
                success: false,
                message: 'First Complete Your Registration'
            }, { status: 404 })
        }

        const isManager = await userModel.findById(managerToAsk)

        if (!isManager || isManager.role == "user") {
            return Response.json({
                success: false,
                message: 'Manager Not Found'
            }, { status: 404 })
        }

        const leaveFrom = new Date(startDate)

        const leaveTo = new Date(endDate)


        const leaveFrom_ = leaveFrom.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const leaveTo_ = leaveTo.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const emailRes = await leaveMail(user.username, isManager.email, leaveType, leaveFrom_, leaveTo_, reason);

        if (!emailRes.sucess) {
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

        const leave = await Leave.create({
            user: user.id,
            leaveType,
            whoApprovedLeave: managerToAsk,
            leaveFrom,
            leaveTo,
            reason
        })

        return Response.json({
            success: true,
            message: 'Leave request submitted successfully',
            leave
        }, { status: 200 })
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message,
            error: error
        }, { status: 500 })
    }

}