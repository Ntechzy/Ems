import dbconn from "@/lib/dbconn";
import { encrypt } from "@/lib/encrypt";
import { AppError } from "@/lib/errors/AppError";
import { isValidDate } from "@/lib/helper/isValidDate";
import { AppResponse } from "@/lib/helper/responseJson";
import { isUserAuthenticated, validateRole } from "@/lib/helper/ValidateUser"
import { BirthDay, Department, Employee, User } from "@/lib/repositories";
import { BirthDayService, DepartmentService, EmployeeService, UserService } from "@/lib/services";

const employeeService = new EmployeeService(new Employee());
const birthDayService = new BirthDayService(new BirthDay(), employeeService);
const departmentService = new DepartmentService(new Department());
const userService = new UserService(new User(), departmentService);
let appResponse;

export async function GET(req, res) {
    await dbconn();

    try {
        appResponse = new AppResponse();
        const params = res.params;
        const searchParams = req.nextUrl.searchParams;
        const sessionUser = await isUserAuthenticated(req, res);


        if (sessionUser) {
            const userIdArr = params.id;

            if (userIdArr) {
                const userId = userIdArr[0];
                if (!userId) {
                    throw new AppError("Please provide correct data", 400);
                } 
                const user = await employeeService.GetById(userId, req, res);
                appResponse.data = user;
 


            } else if (validateRole(sessionUser, ["super_admin", "admin"])) {
                const pageNo = parseInt(searchParams.get("page")) || 1;
                const limit = parseInt(searchParams.get("limit")) || 10;
                const offset = (pageNo - 1) * limit;

                const all_users = await employeeService.GetAllWithPagination(offset, limit);

                appResponse.data = all_users;

            }

            return Response.json(appResponse.getResponse(), { status: 200 });
        }

    } catch (err) {
        appResponse = new AppResponse();
        appResponse.status = false;
        appResponse.message = err.message;
        appResponse.error = { message: "Error While Fetching users" };
        if (err instanceof AppError) {
            return Response.json(appResponse.getResponse(), { status: err.statusCode });
        }
        return Response.json(appResponse.getResponse(), { status: 500 });
    }
}

export async function PATCH(req, res) {
    try {
        await dbconn();
        appResponse = new AppResponse();
        const resource = res.params.id;
        const reqBody = await req.json();
        if (resource == "updateRole") {
            if (!reqBody.userId && !reqBody.role) {
                throw new AppError("Please Provide Complete Data", 400);
            }

            await userService.ChangeUserRole(reqBody.userId, reqBody.role, req, res);
            appResponse.status = true;
            appResponse.message = "Role Updated Successfully";
            return Response.json(appResponse.getResponse());
        }

    } catch (err) {
        appResponse = new AppResponse();
        appResponse.status = false;
        appResponse.message = "Error While Updating Items";
        appResponse.error = err.message;

        return Response.json(appResponse.getResponse(),
            {
                status: 500,
            }
        )
    }
}

export async function PUT(req, res) {
    try {
        const appResponse = new AppResponse();
        await dbconn();

        const { userId, name, email, mobile_no, correspondence_address, associated_with, account_holder_name, bank_name, ifsc_code, account_number, dob } = await req.json();
        const dataToUpdate = {};


        if (name) dataToUpdate.name = name;
        if (email) dataToUpdate.email = email;
        if (mobile_no) dataToUpdate.mobile_no = mobile_no;
        if (correspondence_address) dataToUpdate.correspondence_address = correspondence_address;
        if (associated_with) dataToUpdate.associated_with = associated_with;

        if (Object.keys(dataToUpdate).length > 0) {
            await userService.Update(
                { _id: userId },
                { $set: dataToUpdate }
            );
        }

        const employeeUpdateData = {};
        if (account_holder_name) employeeUpdateData.account_holder_name = encrypt(account_holder_name);
        if (bank_name) employeeUpdateData.bank_name = encrypt(bank_name);
        if (ifsc_code) employeeUpdateData.ifsc_code = encrypt(ifsc_code);
        if (account_number) employeeUpdateData.account_number = encrypt(account_number);
        if (correspondence_address) employeeUpdateData.correspondence_address = correspondence_address;

        if (Object.keys(employeeUpdateData).length > 0) {
            await employeeService.Update(
                { user_id: userId },
                { $set: employeeUpdateData }
            );
        }

        if (name && userId && dob && isValidDate(dob)) {
            await birthDayService.AddAndUpdateDOB({ name, date: dob, userId });
        }

        appResponse.status = true;
        appResponse.message = "User and employee details updated successfully";

        return Response.json(appResponse.getResponse(), { status: 200 });

    } catch (error) {
        const appResponse = new AppResponse();
        appResponse.status = false;
        appResponse.message = error.message;
        appResponse.error = { message: "Error while updating user" };

        if (error instanceof AppError) {
            return Response.json(appResponse.getResponse(), { status: error.statusCode });
        }
        return Response.json(appResponse.getResponse(), { status: 500 });
    }
}
