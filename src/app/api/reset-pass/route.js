import dbconn from "@/lib/dbconn";
import userModel from "@/modal/user";

export async function PUT(req) {
    await dbconn()
    try {
        const { token, newPass } = await req.json() 
        const user = await userModel.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        if (!user) {
            return Response.json({
                sucess: false,
                message: "Token is invalid or expired"
            }, { status: 400 })
        }

        user.password = newPass
        user.resetToken = undefined
        user.resetTokenExpiration = undefined
        await user.save()

        return Response.json({
            sucess: true,
            message: "Password reset successful"
        }, { status: 200 }
        )

    } catch (error) {
        return Response.json({
            sucess: false,
            message: error.message
        }, { status: 500 })
    }
}