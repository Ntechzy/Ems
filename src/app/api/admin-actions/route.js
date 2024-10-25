import dbconn from "@/lib/dbconn";
import { isUserAuthenticated } from "@/lib/helper/ValidateUser";
import ExtraLeave from "@/modal/extrasLeave";
import userModel from "@/modal/user";

export async function PUT(req, res) {
    await dbconn();

    try {
        const authenticatedUser = await isUserAuthenticated(req, res);

        if (!authenticatedUser) {
            return Response.json({
                success: false,
                message: 'You are not logged in to perform this action',
            }, { status: 401 });
        }

        const { id } = await req.json();
        if (!id) {
            return Response.json({
                success: false,
                message: 'User ID is required',
            }, { status: 400 });
        }

        if (authenticatedUser.role === "admin" || authenticatedUser.role === "super_admin") {

            const targetUser = await userModel.findById(id);

            if (!targetUser) {
                return Response.json({
                    success: false,
                    message: 'User not found',
                }, { status: 404 });
            }

            // send experience letter logic bhi likhna hai yha par 

            targetUser.status = !targetUser.status;
            await targetUser.save();

            return Response.json({
                success: true,
                message: 'User status updated successfully',
            }, { status: 200 });
        }

        return Response.json({
            success: false,
            message: 'You are not authorized to perform this action',
        }, { status: 403 });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Some error occurred",
            error: error.message,
        }, { status: 500 });
    }
}

// for adding official leave

export async function POST(req, res) {
    await dbconn();

    try {
        const authenticatedUser = await isUserAuthenticated(req, res);

        if (authenticatedUser.role === "user") {
            return Response.json({
                success: false,
                message: 'You are not authorized to perform this action',
            }, { status: 403 });
        }

        const { dates } = await req.json();

        if (!Array.isArray(dates) || dates.length === 0) {
            return Response.json({
                success: false,
                message: 'Invalid input. Please provide a non-empty array of dates.',
            }, { status: 400 });
        }

        const uniqueLeaves = dates.map(date => new Date(date).toISOString()).filter((date, index, self) => self.indexOf(date) === index);

        const leavesToInsert = uniqueLeaves.map(date => ({
            date: new Date(date),
        }));

        await ExtraLeave.insertMany(leavesToInsert);

        return Response.json({
            success: true,
            message: 'Official leave days added successfully.',
        }, { status: 200 });
    } catch (error) {
        console.log(error);

        return Response.json({
            success: false,
            message: "Some error occurred",
            error: error.message || 'Internal Server Error',
        }, { status: 500 });
    }
}



