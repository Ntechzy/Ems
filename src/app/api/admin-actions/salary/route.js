import dbconn from "@/lib/dbconn";
import { isUserAuthenticated } from "@/lib/helper/ValidateUser";
import Leave from "@/modal/leave";
import moment from "moment";

export async function GET(req, res) {
    await dbconn()
    try {

        const authenticatedUser = await isUserAuthenticated(req, res);
        console.log(authenticatedUser);

        if (!authenticatedUser) {
            return Response.json({
                success: false,
                message: 'You are not authorized to perform this action'
            }, { status: 403 })
        }

        if (authenticatedUser.role === 'user') {
            return Response.json({
                success: false,
                message: 'You are not authorized to perform this action'
            }, { status: 403 })
        }

        const data = await calculateMonthlySalary()
        return Response.json({
            success: true,
            data: data
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: error.message || "Some error occurred"
        }, { status: 500 });
    }
}



const calculateMonthlySalary = async () => {
    const currentMonth = moment().format('YYYY-MM');
    const daysInCurrentMonth = moment().daysInMonth();

    const salaries = await Leave.aggregate([
        {
            $match: {
                month: currentMonth  // Filter for the current month
            }
        },
        {
            $lookup: {
                from: "users",  // Join with the users model
                localField: "user",  // Assuming 'user' is the field in 'Leave' collection
                foreignField: "_id", // Assuming '_id' is the user identifier in 'users' model
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"  // Flatten the user details array
        },
        {
            $lookup: {
                from: "emps",  // Join with the emps model
                localField: "user",  // Assuming 'user' is the field in 'Leave' collection
                foreignField: "user_id",  // Assuming 'user_id' is the field in 'emps' model
                as: "empDetails"
            }
        },
        {
            $unwind: "$empDetails"  // Flatten the empDetails array
        },
        {
            $group: {
                _id: "$user",  // Group by user
                totalAbsentDays: { $sum: "$absentDays" },
                totalOvertimeHours: { $sum: "$overtimeHours" },  // Optional, if applicable
                userData: { $first: "$userDetails" },
                empData: { $first: "$empDetails" }
            }
        },
        {
            $addFields: {
                totalPresentDays: {
                    $subtract: [daysInCurrentMonth, "$totalAbsentDays"]  // Calculate present days
                },
                baseSalaryAsDecimal: {
                    $toDecimal: "$empData.salary"  // Convert base salary (string) to decimal
                }
            }
        },
        {
            $project: {
                userId: "$_id",  // User ID
                userName: "$userData.name",  // Extract name from users model
                totalPresentDays: 1,
                totalAbsentDays: 1,
                totalOvertimeHours: 1,
                baseSalary: 1,  // Base salary in decimal format
                calculatedSalary: {
                    $multiply: [
                        {
                            $divide: [
                                { $subtract: [daysInCurrentMonth, "$totalAbsentDays"] }, // (Total Days in Month - Absent Days)
                                daysInCurrentMonth  // Total Days in Month
                            ]
                        },
                        "$baseSalaryAsDecimal"  // Multiply by the base salary
                    ]
                }
            }
        }
    ]);

    return salaries;
};

