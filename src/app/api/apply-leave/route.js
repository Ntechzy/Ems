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
            RequestedTo: managerToAsk,
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

export async function GET(req, res) {
    await dbconn()
    try {
        const user = await isUserAuthenticated(req, res)
        if (!user.role == 'admin' || !user.role == "super_admin") {
            return Response.json({
                success: false,
                message: 'You are not authorized to perform this action'
            }, { status: 401 })
        }

        const leave = await Leave.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $project: {
                    leaveType: 1,
                    leaveFrom: 1,
                    leaveTo: 1,
                    RequestedTo: 1,
                    isApproved: 1,
                    result: {
                        $map: {
                            input: "$result",
                            as: "user",
                            in: {
                                _id: "$$user._id",
                                name: "$$user.name",

                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ])

        return Response.json({
            success: true,
            leave
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Something Went Wrong",
            error: error
        }, { status: 500 })
    }
}

export async function PUT(req, res) {
    await dbconn()
    try {
        const user = await isUserAuthenticated(req, res)
        const { leave_id, requested_to, is_approved } = await req.json()

        // checking for the authorize

        if (!user.role == 'admin' || user?.id != requested_to) {
            return Response.json({
                success: false,
                message: 'You are not authorized to perform this action'
            }, { status: 403 })
        }

        if (!leave_id || !requested_to || !is_approved) {
            return Response.json({
                success: false,
                message: 'All fields are required'
            }, { status: 400 })
        }

        const leave = await Leave.findById(leave_id)

        if (!leave) {
            return Response.json({
                success: false,
                message: 'Leave not found'
            }, { status: 404 });
        }

        if (leave.RequestedTo != requested_to) {
            return Response.json({
                success: false,
                message: 'Requested Id is Wrong'
            }, { status: 403 })
        }

        leave.isApproved = (is_approved === "Approve");
        await leave.save();


        return Response.json({
            success: true,
            message: `Leave ${is_approved} successfully`,
            leave
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Something Went Wrong",
            error: error
        }, { status: 500 })
    }
}