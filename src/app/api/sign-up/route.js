import dbconn from "@/lib/dbconn";
import { sendOnboarding } from "@/lib/resend";
import Department from "@/modal/department";
import employeeModel from "@/modal/employee";
import userModel from "@/modal/user";
import mongoose from "mongoose";

export async function POST(req) {
    await dbconn();

    try {
        const {
            name, email, password, mobile_no, role,
            designation, department, alloted_hardwares, alloted_softwares, associated_with,
            salary, interview_done_by, who_finalize_salary
        } = await req.json();


        // Convert strings to ObjectId 

        const hardwareObjectIds = alloted_hardwares.map(id => (typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id));
        const softwareObjectIds = alloted_softwares.map(id => (typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id));
        const interview_done_by_Ids = (typeof interview_done_by === "string" ? new mongoose.Types.ObjectId(interview_done_by) : interview_done_by);
        const who_finalize_salary_Ids = (typeof who_finalize_salary === "string" ? new mongoose.Types.ObjectId(who_finalize_salary) : who_finalize_salary);
        const department_Ids = (typeof department === "string" ? new mongoose.Types.ObjectId(department) : department);




        const employee_id = name.slice(0, 4) + mobile_no.slice(5, 10) + email.slice(0, 4);
        const isUser = await userModel.findOne({ email, mobile_no });

        let user, employee;

        if (isUser) {
            const isEmployee = await employeeModel.findOne({ user_id: isUser._id });
            if (isEmployee) {
                return Response.json(
                    {
                        success: false,
                        message: "User & Employee Already Exists"
                    },
                    {
                        status: 400,
                    }
                );
            }


            employee = await employeeModel.create({
                user_id: isUser._id,
                alloted_hardwares: hardwareObjectIds,
                alloted_softwares: softwareObjectIds,
                salary,
                interview_done_by: interview_done_by_Ids,
                who_finalized_salary: who_finalize_salary_Ids
            });
        } else {
            user = await userModel.create({
                employee_id,
                name,
                email,
                password,
                mobile_no,
                associated_with,
                role,
                designation,
                department: department_Ids
            });

            employee = await employeeModel.create({
                user_id: user._id,
                alloted_hardwares: hardwareObjectIds,
                alloted_softwares: softwareObjectIds,
                salary,
                interview_done_by: interview_done_by_Ids,
                who_finalized_salary: who_finalize_salary_Ids
            });
        }
        if (role === 'admin') {
            await Department.findOneAndUpdate(
                { name: department },
                { $push: { manager: user._id } },
                { new: true }
            );
        }

        // Sending mail
        const protocol = req.headers.get('x-forwarded-proto') ?? 'http';
        const host = req.headers.get('host');
        const link = `${protocol}://${host}/login`;
        const emailRes = await sendOnboarding(name, email, employee_id, password, link);

        if (!emailRes.sucess) {
            if (isUser) {
                await employeeModel.deleteOne({ user_id: isUser._id });
            } else {
                await userModel.deleteOne({ _id: user._id });
                await employeeModel.deleteOne({ user_id: user._id });
            }
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

        return Response.json(
            {
                success: true,
                emailRes: emailRes,
                message: "User Registered Successfully",
            },
            {
                status: 200,
            }
        );

    } catch (err) {
        return Response.json(
            {
                success: false,
                message: "Error While Registering user",
                error: err.message
            },
            {
                status: 500,
            }
        );
    }
}
