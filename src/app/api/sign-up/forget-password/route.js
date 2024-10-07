import dbconn from "@/lib/dbconn";
import userModel from "@/modal/user";
import crypto from 'crypto';
import { resetMail } from "@/lib/resend";
export async function POST(req) {
    await dbconn()
    try {
        const { empId } = await req.json()
        console.log(empId);

        if (!empId) {
            return Response.json({
                sucess: false,
                message: "Employee ID is required"
            }, { status: 400 })
        }

        const user = await userModel.findOne({ employee_id: empId })

        if (!user) {
            return Response.json({
                sucess: false,
                message: "Ooops... You Miss Something! Try Again"
            }, { status: 404 })
        }

        const token = crypto.randomBytes(16).toString('hex');

        const protocol = req.headers.get('x-forwarded-proto') ?? 'http';
        const host = req.headers.get('host');
        const link = `${protocol}://${host}/reset/${token}`;

        const expiration = new Date(Date.now() + 10 * 60 * 1000);

        user.resetToken = token
        user.resetTokenExpiration = expiration
        await user.save()

        const emailRes = await resetMail(user.name, user.email, link);

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

        return Response.json({
            sucess: true,
            message: "Reset Mail Sent Sucessfully"
        }, { status: 200 })
    } catch (error) {
        return Response.json({
            sucess: false,
            message: "Unexpected Error",
            error: error.message
        }, { status: 500 })
    }
}