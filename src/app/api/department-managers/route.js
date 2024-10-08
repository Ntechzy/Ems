import dbconn from "@/lib/dbconn";
import { getServerSession } from "next-auth";
import { Option } from "../auth/[...nextauth]/option";
import userModel from "@/modal/user";
import Department from "@/modal/department";

const fetchDepartment = async (id) => {
    return Department.findById(id)
        .populate('manager', 'name email')
        .select('manager');
};

export async function GET(req) {
    await dbconn();

    try {
        const session = await getServerSession(Option);

        const id = req.nextUrl.searchParams.get('id');

        if (!session && !id) {
            return Response.json({
                success: false,
                message: 'Please Login'
            }, { status: 401 });
        }

        let department;

        if (!id) {
            const user = await userModel.findById(session.user.id);
            if (!user || !user.department) {
                return Response.json({
                    success: false,
                    message: 'user or department not found'
                }, { status: 404 });
            }

            department = await fetchDepartment(user.department);

        } else {
            department = await fetchDepartment(id);
        }

        if (!department) {
            return Response.json({
                success: false,
                message: 'department not found'
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message:"",
            department,
        }, { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            message: `Error: ${error.message}`,
        }, { status: 500 });
    }
}
