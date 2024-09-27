import dbconn from "@/lib/dbconn";
import employeeModel from "@/modal/employee";
import userModel from "@/modal/user";
import mongoose from "mongoose";
export async function POST(req) {
    await dbconn();
    try {
        const {
            name, email, password, mobile_no, location, role,
            designation, department, alloted_hardwares, alloted_softwares, associated_with
        } = await req.json();

        const hardwareObjectIds = alloted_hardwares
            .map(id => (typeof id === 'string' && new mongoose.Types.ObjectId(id)))

        const softwareObjectIds = alloted_softwares
            .map(id => (typeof id === 'string' && new mongoose.Types.ObjectId(id)))

        const isUser = await userModel.findOne({ email, mobile_no }); 

        if (isUser) {
            const isEmployee = await employeeModel.findOne({ user_id: isUser._id }); 

            if (isEmployee) {
                return Response.json(
                    {
                        sucess: false,
                        message: "User & Employee Already Exists"
                    },
                    {
                        status: 400,
                    }
                )
            }

            const employee = await employeeModel.create({
                user_id: isUser._id,
                location,
                alloted_hardwares: hardwareObjectIds,
                alloted_softwares: softwareObjectIds
            })

            return Response.json(
                {
                    sucess: true,
                    message: "User Registered Successfully",
                    employee,
                },
                {
                    status: 200,
                }
            )

        } else {
            const employee_id = name.slice(0, 4) + mobile_no.slice(5, 10) + email.slice(0, 4)

            const user = await userModel.create({
                employee_id,
                name,
                email,
                password,
                mobile_no,
                associated_with,
                role,
                designation,
                department
            })

            const employee = await employeeModel.create({
                user_id: user._id,
                location,
                alloted_hardwares: hardwareObjectIds,
                alloted_softwares: softwareObjectIds
            })

            return Response.json(
                {
                    sucess: true,
                    message: "User Registered Successfully",
                    employee,
                    user
                },
                {
                    status: 200,
                }
            )
        }
    }
    catch (err) {
        console.log("Error While Registering user ", err)
        return Response.json(
            {
                sucess: false,
                message: "Error While Registering user",
                error: err.message

            },
            {
                status: 500,
            }
        )

    }
}