import dbconn from "@/lib/dbconn"
import { Option } from "../../auth/[...nextauth]/option"
import bcrypt from "bcrypt"
import userModel from "@/modal/user"
import { getServerSession } from "next-auth"

export async function PUT(req) {
    await dbconn()
    const session = await getServerSession(Option)

    try {
        const { oldPass, newPass } = await req.json()

        if (!session) {
            return Response.json(
                {
                    sucess: false,
                    message: "You are not login"
                },
                { status: 400 })
        }

        const user = await userModel.findById(session?.user.id)

        if (!user) {
            return Response.json(
                {
                    sucess: false,
                    message: "User not found"
                },
                { status: 404 })
        }

        const isValidPass = await bcrypt.compare(oldPass, user.password)

        if (!isValidPass) {
            return Response.json(
                {
                    sucess: false,
                    message: "Invalid old password"
                },
                { status: 400 }
            )
        }

        user.password = newPass
        await user.save()
        return Response.json(
            {
                sucess: true,
                message: "Password successful Updated"
            },
            { status: 200 }
        )

    } catch (error) {
        return Response.json(
            {
                sucess: false,
                message: "Error Occur! ",
                error: error.message
            },
            { status: 500 }
        )
    }
}