import { isUserAuthenticated } from "@/lib/helper/ValidateUser";
import employeeModel from "@/modal/employee";
import Leave from "@/modal/leave";
import userModel from "@/modal/user";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";

const getDaysInMonth = (month, year) => {

    const date = new Date(year, month, 0);
    return date.getDate();
};

const calculateSalary = (totalDaysInMonth, totalAbsentDays, dailySalary) => {
    const salary = (30 - totalAbsentDays) * dailySalary;
    const fixed_Salary = parseFloat(salary.toFixed(2));
    return fixed_Salary
};
export async function GET(req, res) {
    try {
        const url = new URL(req.url);

        const month = url.searchParams.get('month')


        const [year, monthNumber] = month.split("-");
        const currentMonth = parseInt(monthNumber) - 1;
        const currentYear = parseInt(year);

        const totalDaysInMonth = getDaysInMonth(currentMonth + 1, currentYear);


        const employees = await employeeModel.find();

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
                        totalAbsentDays: { $sum: "$absentDays" } // Sum the absentDays field
                    }
                }
            ]);

            const totalAbsentDays = leaveData.length > 0 ? leaveData[0].totalAbsentDays : 0;

            const dailySalary = employee.salary / 30;
            const salary = calculateSalary(totalDaysInMonth, totalAbsentDays, dailySalary);
            const user_name = await userModel
                .findById(employee.user_id)
                .select("name");

            if (!user_name) {
                continue;
            }

            results.push({
                employeeId: employee._id,
                employeeName: user_name.name,
                totalAbsentDays,
                salary
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

