import dbconn from "@/lib/dbconn";
import { isUserAuthenticated, validateRole } from "@/lib/helper/ValidateUser";
import Department from "@/modal/department";
import hardwareModel from "@/modal/hardware";
import softwareModel from "@/modal/software";

export async function GET(req, res) {
    await dbconn()
    try {
        const isUser = await isUserAuthenticated(req, res)
        if (isUser) {

            if (isUser.role === "user") {
                return Response.json(
                    {
                        sucess: true,
                        message: "User Not Authenticated",
                    },
                    { status: 400 },
                )
            }

            const hardware = await hardwareModel.find({}).select('name value')
            const software = await softwareModel.find({}).select('name value')
            const department = await Department.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "manager",
                        foreignField: "_id",
                        as: "manager",
                    }
                },
                {
                    $project: {
                        name: 1,
                        designations: 1,
                        manager: {
                            $map: {
                                input: "$manager",
                                as: "manager",
                                in: {
                                    _id: "$$manager._id",
                                    name: "$$manager.name"

                                }
                            }

                        }
                    }
                }
            ]);
            const data = {
                hardware,
                software,
                department
            };

            return Response.json(
                {
                    sucess: false,
                    message: "User Authenticated",
                    data
                },
                { status: 200 },
            )

        }
        return Response.json(
            {
                sucess: true,
                message: "User Authenticated",
                user: isUser
            },
            { status: 200 },
        )

    } catch (error) {
        return Response.json(
            {
                sucess: false,
                message: "Something went Wrong",
                error: error.message
            },
            { status: 401 },
        )
    }
}