import { decrypt } from "@/lib/encrypt";
import { isUserAuthenticated } from "@/lib/helper/ValidateUser";
import employeeModel from "@/modal/employee";
import Leave from "@/modal/leave";
import userModel from "@/modal/user";

const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 0);
    return date.getDate();
};

const calculateSalary = (totalDaysInMonth, totalAbsentDays, dailySalary) => {
    const salary = (30 - totalAbsentDays) * dailySalary;
    const fixed_Salary = parseFloat(salary.toFixed(2));
    return fixed_Salary;
};

export async function GET(req, res) {
    try {
        const isAuthenticated = await isUserAuthenticated(req, res);

        if (!isAuthenticated) {
            return Response.json({
                success: false,
                message: "You are not authorized to perform this action"
            }, { status: 403 });
        }

        const url = new URL(req.url);
        const month = url.searchParams.get('month');

        const [year, monthNumber] = month.split("-");
        const currentMonth = parseInt(monthNumber) - 1;
        const currentYear = parseInt(year);

        const totalDaysInMonth = getDaysInMonth(currentMonth + 1, currentYear);

        let employees = [];
        if (isAuthenticated.role === "user") {
            const employee = await employeeModel.findOne({ user_id: isAuthenticated.id });
            employees = employee ? [employee] : [];
        } else {
            employees = await employeeModel.find();
        }

        const results = [];

        for (let employee of employees) {
            const leaveData = await Leave.aggregate([
                {
                    $match: {
                        user: employee.user_id,
                        month: month
                    }
                },
                {
                    $group: {
                        _id: "$user",
                        totalAbsentDays: { $sum: "$absentDays" },
                        amount: { $first: "$deducted.amount" },
                        deductedReason: { $first: "$deducted.reason" }
                    }
                }
            ]);

            // If leaveData is empty, provide default values
            const totalAbsentDays = leaveData.length > 0 ? leaveData[0].totalAbsentDays : 0;
            const extraDeduction = leaveData.length > 0 && leaveData[0].amount ? leaveData[0].amount : 0
            const deductedReason = leaveData.length > 0 && leaveData[0].deductedReason ? leaveData[0].deductedReason : 'N/A';

            const dailySalary = decrypt(employee.salary) / 30 || employee.salary / 30;

            const deductedDays = extraDeduction / dailySalary;

            const totalDeductionDays = totalAbsentDays + deductedDays
            const salary = calculateSalary(totalDaysInMonth, totalDeductionDays, dailySalary);
            const user_name = await userModel
                .findById(employee.user_id)
                .select("name");

            if (!user_name) {
                continue;
            }

            results.push({
                employeeId: employee.user_id,
                employeeName: user_name.name,
                totalDaysInMonth,
                totalAbsentDays,
                basesalary: decrypt(employee.salary) || employee.salary,
                extraDeductionAmount: extraDeduction.toFixed(2),
                extraDeductionDays: deductedDays.toFixed(2),
                deductedReason: deductedReason,
                salary,
                month: month
            });
        }

        return Response.json({
            success: true,
            message: 'Salary Calculated Successfully',
            results
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Something Went Wrong",
            error: error
        }, { status: 500 });
    }
}

export async function PUT(req, res) {
    try {
        const isAuthenticated = await isUserAuthenticated(req, res);

        if (!isAuthenticated || isAuthenticated.role === "user") {
            return Response.json({
                success: false,
                message: "You are not authorized to perform this action",
            }, { status: 403 });
        }

        const body = await req.json();
        const { userId, month, reason, amount } = body;


        if (!userId || !month || !reason || amount === undefined) {
            return Response.json({
                success: false,
                message: "User ID, month, reason, and days are required",
            }, { status: 400 });
        }

        let leave = await Leave.findOne({ user: userId, month });

        if (leave) {
            leave.deducted.amount = amount;
            leave.deducted.reason = reason;
        } else {
            leave = new Leave({
                user: userId,
                month,
                casualDays: 0,
                absentDays: 0,
                deducted: { amount, reason },
                shortDays: 0,
                leaveDetails: [],
            });
        }

        await leave.save();

        return Response.json({
            success: true,
            message: "Deduction updated successfully",
            data: {
                userId: leave.user,
                month: leave.month,
                deducted: leave.deducted,
            },
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        }, { status: 500 });
    }
}
