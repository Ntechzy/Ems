import dbconn from "@/lib/dbconn";
import { isUserAuthenticated } from "@/lib/helper/ValidateUser";

export async function POST(req, res) {
    await dbconn()
    try {
        const isAuthenticated = await isUserAuthenticated(req, res);
        return Response.json({
            success: true,
            user: isAuthenticated,
            message: 'You are authorized to perform this action',
        }, { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Some error occurred",
            error: error.message,
        }, { status: 500 });
    }
}