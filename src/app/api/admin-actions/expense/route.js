import dbconn from "@/lib/dbconn";
import { getCurrentMonth } from "@/lib/helper/GetCurrentMonth";
import { isUserAuthenticated } from "@/lib/helper/ValidateUser";
import expenseItemModel from "@/modal/expenseItems";
import expenseSheetModel from "@/modal/expenseSheet";
import userModel from "@/modal/user";

export async function POST(req, res) {
    await dbconn()
    try {
        const { title, amount, company, date } = await req.json()
        const isAuthenticated = await isUserAuthenticated(req, res);

        const user = await userModel.findOne({ _id: isAuthenticated.id });

        const currentMonth = getCurrentMonth()

        if (!title || typeof title !== "string" || title.trim() === "") {
            return Response.json({ success: false, message: "Invalid title" }, { status: 400 });
        }

        if (!amount || typeof amount !== "number" || amount <= 0) {
            return Response.json({ success: false, message: "Invalid amount" }, { status: 400 });
        }

        if (!company || typeof company !== "string" || company.trim() === "") {
            return Response.json({ success: false, message: "Invalid company" }, { status: 400 });
        }

        let expenseSheet = await expenseSheetModel.findOne({ month: currentMonth }) || new expenseSheetModel({
            expenses: [],
            month: currentMonth,
            amount: 0
        });

        if (user.expenseAcess === "restricted") {
            return Response.json({
                success: false,
                message: "You are not authorized to perform this action",
            }, { status: 400 })
        }


        const expense = await expenseItemModel.create({
            title,
            amount,
            date,
            company,
            location: user.location,
            createdBy: isAuthenticated.id
        });

        expenseSheet.expenses.push(expense._id);
        expenseSheet.amount += amount;
        await expenseSheet.save();



        return Response.json({
            success: true,
            message: "Expense added successfully",
            expense: expense
        }, { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Some error occurred",
            error: error.message,
        }, { status: 500 });
    }
}

const fetchExpenseSheet = async (currentMonth, locationFilter = null, option = {}) => {
    const query = { month: currentMonth };
    const populateOptions = {
        path: "expenses",
    };

    if (option.includeCreatedBy) {
        populateOptions.populate = { path: "createdBy", select: "name email" };
    }

    if (locationFilter) {
        populateOptions.match = { location: locationFilter };
    }

    const expenseSheet = await expenseSheetModel.findOne(query).populate(populateOptions);
    return {
        expenses: expenseSheet ? expenseSheet.expenses : [],
        totalAmount: expenseSheet?.amount || 0,
    };
};

export async function GET(req, res) {
    await dbconn()
    try {
        const isAuthenticated = await isUserAuthenticated(req, res);
        const { id, role } = isAuthenticated;
        var expenseData
        const user = await userModel.findById(id);

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        if (user.expenseAcess === "restricted") {
            return Response.json(
                {
                    success: false,
                    message: "You are not authorized to perform this action",
                },
                { status: 403 }
            );
        }

        const currentMonth = getCurrentMonth();

        if (role === "admin" && user.expenseAcess === 'allow') {
            expenseData = await fetchExpenseSheet(currentMonth, user.location);
        } else if (role === 'super_admin') {
            expenseData = await fetchExpenseSheet(currentMonth, null, { includeCreatedBy: true });
        } else {
            return Response.json(
                { success: false, message: "Invalid role or permissions" },
                { status: 403 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Expense fetched successfully",
                expenseSheet: expenseData.expenses,
                totalAmount: expenseData.totalAmount,
            },
            { status: 200 }
        );


    } catch (error) {
        console.log(error);

        return Response.json({
            success: false,
            message: "Some error occurred",
            error: error.message,
        }, { status: 500 });
    }
}