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

        const { leaveType, managerToAsk, startDate, endDate, reason } = await req.json()
        let casualLeaveAutoApproved = false;
        let approvedDays = [];
        const employee = await employeeModel.findOne({ user_id: user.id })

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

        const processLeave = async (month, fromDate, toDate) => {

            let leaveDoc = await Leave.findOne({ user: user.id, month }) || new Leave({
                user: user.id,
                month,
                casualDays: 0,
                absentDays: 0,
                leaveDetails: []
            });

            const leaveDays = (toDate.getDate() - fromDate.getDate()) + 1;
            if (leaveDays < 0) {
                throw new Error("Invalid date: The end date must be after the start date.");
            }
            if (leaveType === 'casual') {
                if (leaveDoc.casualDays !== 0) {
                    throw new Error("You have already taken your casual leave for this month.");
                }
                if (leaveDays > 1) {
                    throw new Error(`You requested for ${leaveDays} days but your organization only allow 1 casual leave a month`);
                }
                leaveDoc.casualDays = 1;
                casualLeaveAutoApproved = true;
                approvedDays.push(fromDate.toISOString().split('T')[0]);
            } else {
                leaveDoc.absentDays += leaveDays - (leaveDoc.casualDays > 0 ? 0 : 1);
                if (leaveDoc.casualDays === 0) {
                    leaveDoc.casualDays = 1
                    casualLeaveAutoApproved = true;
                    approvedDays.push(fromDate.toISOString().split('T')[0]);
                }

            }

            leaveDoc.leaveDetails.push({
                leaveType,
                leaveFrom: fromDate,
                leaveTo: toDate,
                reason,
                RequestedTo: managerToAsk,
                isApproved: leaveType === 'casual' ? true : null
            });

            await leaveDoc.save();
        };


        const leaveFrom_ = leaveFrom.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const leaveTo_ = leaveTo.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });



        if (startMonth === endMonth) {
            await processLeave(startMonth, leaveFrom, leaveTo);
        } else {
            const lastDayOfStartMonth = new Date(leaveFrom.getFullYear(), leaveFrom.getMonth() + 1, 0);
            lastDayOfStartMonth.setHours(23, 59, 59, 999);

            const firstDayOfEndMonth = new Date(leaveTo.getFullYear(), leaveTo.getMonth(), 1);
            firstDayOfEndMonth.setHours(23, 59, 59, 999);

            await processLeave(startMonth, leaveFrom, lastDayOfStartMonth);

            await processLeave(endMonth, firstDayOfEndMonth, leaveTo);
        }

        let message;
        if (casualLeaveAutoApproved) {
            message = `Casual leave has been automatically approved for the following days: ${approvedDays.join(', ')}.`;
        } else {
            message = 'Leave request submitted successfully.';
        }


        const emailRes = await leaveMail(user.username, isManager.email, leaveType, leaveFrom_, leaveTo_, reason, approvedDays);

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
                    as: "userDetails" 
                }
            },
            {
                $unwind: "$userDetails" 
            },
            {
                $unwind: "$leaveDetails" 
            },
            {
                $project: {
                    user: {
                        _id: "$userDetails._id",
                        name: "$userDetails.name"
                    },
                    month: 1,
                    casualDays: 1,
                    absentDays: 1,
                    leaveType: "$leaveDetails.leaveType",
                    leaveFrom: "$leaveDetails.leaveFrom",
                    leaveTo: "$leaveDetails.leaveTo",
                    reason: "$leaveDetails.reason",
                    RequestedTo: "$leaveDetails.RequestedTo",
                    isApproved: "$leaveDetails.isApproved"
                }
            },
            {
                $sort: {
                    _id: -1  
                }
            }
        ]);

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