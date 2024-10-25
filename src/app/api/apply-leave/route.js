import dbconn from "@/lib/dbconn";
import { isUserAuthenticated } from "@/lib/helper/ValidateUser";
import employeeModel from "@/modal/employee";
import Leave from "@/modal/leave";
import userModel from "@/modal/user";
import { leaveMail } from "@/lib/resend";
import { processLeave } from "@/lib/helper/ProcessLeave";
import mongoose from "mongoose";
import { countLeaveDays } from "@/lib/helper/CalculateLeaveDays";
import { getNextMonth } from "@/lib/helper/CalculateLeaveDays";
import ExtraLeave from "@/modal/extrasLeave";


export async function POST(req, res) {
    await dbconn()
    try {
        const user = await isUserAuthenticated(req, res)
        console.log(user.role);

        const { leaveType, managerToAsk, startDate, endDate, reason, userId } = await req.json()

        console.log("managerToAsk", leaveType);

        if (userId !== user._id && user.role !== "admin" && user.role !== "super_admin") {
            return Response.json({
                success: false,
                message: 'You can only apply for your own leave'
            }, { status: 401 });
        }

        const employee = await employeeModel.findOne({ user_id: userId })

        const leaveFrom = new Date(startDate)
        const leaveTo = new Date(endDate)

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


        const startMonth = `${leaveFrom.getFullYear()}-${leaveFrom.getMonth() + 1}`;
        const endMonth = `${leaveTo.getFullYear()}-${leaveTo.getMonth() + 1}`;

        const leaveFrom_ = leaveFrom.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const leaveTo_ = leaveTo.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        if (startMonth === endMonth) {
            await processLeave(userId, startMonth, leaveFrom, leaveTo, leaveType, managerToAsk, reason);
        } else {
            const lastDayOfStartMonth = new Date(leaveFrom.getFullYear(), leaveFrom.getMonth() + 1, 0);
            lastDayOfStartMonth.setHours(23, 59, 59, 999);

            const firstDayOfEndMonth = new Date(leaveTo.getFullYear(), leaveTo.getMonth(), 1);

            firstDayOfEndMonth.setHours(23, 59, 59, 999);
            await processLeave(userId, startMonth, leaveFrom, lastDayOfStartMonth, leaveType, managerToAsk, reason);


            await processLeave(userId, endMonth, firstDayOfEndMonth, leaveTo, leaveType, managerToAsk, reason);

        }

        let message = 'Leave request submitted successfully.';


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

        return Response.json({ success: true, message }, { status: 200 });
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message || "Some error occurred"
        }, { status: 500 });
    }

}

export async function GET(req, res) {
    await dbconn()
    try {
        const user = await isUserAuthenticated(req, res)

        if (!user) {
            return Response.json({
                success: false,
                message: 'You are not Login to perform this action'
            }, { status: 401 });
        }

        const url = new URL(req.url);

        // for all common user also  

        const userId = url.searchParams.get('userId');
        console.log("userId", userId);

        const userIdObjectId = userId && new mongoose.Types.ObjectId(userId);
        const view = url.searchParams.get('view') || 'self';
        const month = url.searchParams.get('month');

        const nextMonth = getNextMonth(month);

        let matchQuery = {};

        if (view === "all" && (user.role === 'super_admin' || user.role === 'admin')) {
            if (month) {
                matchQuery = {
                    $or: [
                        { month },
                        { month: nextMonth }
                    ]
                }
            } else {

                return Response.json({
                    success: false,
                    message: 'Some API Parameter is missing'
                }, { status: 400 })
            }
        }
        else {
            if (user.role === 'user' && userId != user.id) {
                return Response.json({
                    success: false,
                    message: 'You are not authorized to view other users leave details.'
                }, { status: 403 });
            }
            if (!userIdObjectId) {
                return Response.json({
                    success: false,
                    message: 'Some API Parameter is missing'
                }, { status: 400 })
            }

            matchQuery = {
                user: userIdObjectId,
                $or: [
                    { month },
                    { month: nextMonth }
                ]
            }
        }

        const leave = await Leave.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            // Flattening the leaveDetails array without grouping it into a single document
            {
                $unwind: "$leaveDetails",
            },
            {
                $group: {
                    _id: {
                        user: "$user",
                        leaveId: "$leaveDetails._id", // Separate each leave entry based on its unique leave ID
                    },
                    totalCasualDays: { $sum: "$casualDays" },
                    totalAbsentDays: { $sum: "$absentDays" },
                    totalShortLeave: { $sum: "$shortDays" },
                    userData: { $first: "$userDetails" },
                    leaveDetails: { $first: "$leaveDetails" }, // Get each leave record individually
                },
            },
            {
                $project: {
                    user: {
                        name: "$userData.name",
                    },
                    leaveType: "$leaveDetails.leaveType",
                    leaveId: "$leaveDetails._id",
                    leaveFrom: "$leaveDetails.leaveFrom",
                    leaveTo: "$leaveDetails.leaveTo",
                    reason: "$leaveDetails.reason",
                    RequestedTo: "$leaveDetails.RequestedTo",
                    isApproved: "$leaveDetails.isApproved",
                    totalCasualDays: 1,
                    totalAbsentDays: 1,
                    totalShortLeave: 1,
                },
            },
            {
                $sort: {
                    _id: -1,
                },
            },
        ]);




        return Response.json({
            success: true,
            message: 'Leave Details Fetched Successfully',
            leave
        }, { status: 200 });

    } catch (error) {
        console.log(error);

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

        const leave = await Leave.findOne({ "leaveDetails._id": leave_id });

        const leaveDetailIndex = leave.leaveDetails.findIndex(detail => detail._id.toString() === leave_id);

        if (!leave) {
            return Response.json({
                success: false,
                message: 'Leave not found'
            }, { status: 404 });
        }

        if (leave.leaveDetails[leaveDetailIndex].RequestedTo != requested_to) {
            return Response.json({
                success: false,
                message: 'Requested Id is Wrong'
            }, { status: 403 })
        }


        if (is_approved === "Remove") {
            const from = leave.leaveDetails[leaveDetailIndex].leaveFrom;
            const to = leave.leaveDetails[leaveDetailIndex].leaveTo;
            const officialOff = await ExtraLeave.find({})
            const calculate = countLeaveDays(from, to, officialOff)

            if (leave.leaveDetails[leaveDetailIndex].leaveType == "casual") {
                leave.casualDays = leave.casualDays - 1
            }
            else {
                leave.absentDays = leave.absentDays - calculate
            }

            leave.leaveDetails[leaveDetailIndex].isApproved = false
            leave.save()
            return Response.json({
                success: true,
                message: `Leave ${is_approved} successfully`,
            }, { status: 200 })
        }

        leave.leaveDetails[leaveDetailIndex].isApproved = (is_approved === "Approve");
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