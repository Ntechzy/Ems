import dbconn from "@/lib/dbconn";
import { encrypt } from "@/lib/encrypt";
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
        

        const employee_id = name.slice(0, 4) + mobile_no.slice(5, 10) + email.slice(0, 4);
        const isUser = await userModel.findOne({ email, mobile_no });

        let user, employee;
        const encryptSalary=encrypt(salary);

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
                alloted_hardwares,
                alloted_softwares,
                salary,
                interview_done_by,
                who_finalized_salary: who_finalize_salary
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
                department
            });

            employee = await employeeModel.create({
                user_id: user._id,
                alloted_hardwares,
                alloted_softwares,
                salary: encryptSalary,
                interview_done_by,
                who_finalized_salary: who_finalize_salary
            });
        }
        if (role === 'admin') {
            await Department.findOneAndUpdate(
                { _id: department },
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
