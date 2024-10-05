import dbconn from "@/lib/dbconn"
import { getServerSession } from "next-auth"
import { Option } from "../auth/[...nextauth]/option"
import userModel from "@/modal/user"
import Department from "@/modal/department"

export async function GET(req) {
    await dbconn()
    try {
        const value = req.nextUrl.searchParams
        var department;
        const id = value.get('id')
        if (id) {
            department = await Department.findById(id)
            if (!department) {
                return Response.json(
                    {
                        sucess: false,
                        message: 'Department not found'
                    }, { status: 404 }
                )
            }

            const session = await getServerSession(Option)

            if (!session) {
                return Response.json(
                    {
                        sucess: false,
                        message: 'Please login First'
                    }, { status: 404 }
                )
            }

            const user = await userModel.findById(session.user.id)
            // department = 
        }
        return Response.json({ sucess: true, data: id })

        // const user = await userModel.findById(session.user.id)

    } catch (error) {
        return Response.json({
            sucess: false,
            msg: error.message
        }, { status: 500 })
    }
}