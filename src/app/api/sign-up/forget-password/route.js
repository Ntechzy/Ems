import dbconn from "@/lib/dbconn";
import { getServerSession } from "next-auth";
import { Option } from "../../auth/[...nextauth]/option";
import userModel from "@/modal/user";
import crypto from 'crypto';
import { resetMail } from "@/lib/resend";
export async function GET(req) {
    await dbconn()
    const session = await getServerSession(Option)

    try {
        if (!session) {
            return Response.json({
                sucess: false,
                message: "Please Login First"
            }, { status: 401 })
        }
        const user = await userModel.findById(session.user.id)
        if (!user) {
            return Response.json({
                sucess: false,
                message: "User not found"
            }, { status: 404 })
        }

        const token = crypto.randomBytes(16).toString('hex');

        const protocol = req.headers.get('x-forwarded-proto') ?? 'http';
        const host = req.headers.get('host');
        const link = `${protocol}://${host}/reset/${token}`;

        const expiration = new Date(Date.now() + 10 * 60 * 1000);


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
        })
    } catch (error) {
        return Response.json({
            sucess: false,
            message: "Unexpected Error",
            error: error.message
        }, { status: 500 })
    }
    return Response.json({ message: 'GET request received', session });
}