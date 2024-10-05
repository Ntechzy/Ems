import dbconn from "@/lib/dbconn";
import { AppError } from "@/lib/errors/AppError";
import { AppResponse } from "@/lib/helper/responseJson";
import {isUserAuthenticated, validateRole} from "@/lib/helper/ValidateUser"
import { Employee, User } from "@/lib/repositories";
import { EmployeeService, UserService } from "@/lib/services";
import { Employee, User } from "@/lib/repositories";
import { EmployeeService, UserService } from "@/lib/services";

const employeeService = new EmployeeService(new Employee());
const userService = new UserService(new User());
const userService = new UserService(new User());
let appResponse;

export async function GET(req,res){
    try {
        appResponse = new AppResponse();
        await dbconn();
        const params = res.params;
        const searchParams = req.nextUrl.searchParams;
        const sessionUser = await isUserAuthenticated(req , res);
        if(sessionUser){
            const userIdArr = params.id;
            if(userIdArr){
                const userId = userIdArr[0];
                if(!userId){
                    throw new AppError("Please provide correct data" , 400);
                }
                const user = await employeeService.GetById(userId , req , res);
                appResponse.data = user;

            }else if(validateRole(sessionUser,["super_admin","admin"])){
                const pageNo = parseInt(searchParams.get("page")) || 1;
                const limit = parseInt(searchParams.get("limit")) || 10;
                const offset = (pageNo - 1) * limit;

                const all_users = await employeeService.GetAllWithPagination(offset , limit);

                appResponse.data = all_users;

            }

            return Response.json(appResponse.getResponse(),{status:200});
        }
    
    } catch (err) {
        appResponse = new AppResponse();
        appResponse.status = false;
        appResponse.message = err.message;
        appResponse.error = {message:"Error While Fetching users"};
        if(err instanceof AppError){
            return Response.json(appResponse.getResponse(),{status:err.statusCode});
        }
        return Response.json(appResponse.getResponse(),{status:500});
    }
}

export async function PATCH(req , res){
    try {
        await dbconn();
        appResponse = new AppResponse();
        const resource = res.params.id;
        const reqBody = await req.json();
        if(resource == "updateRole" ){
            if(!reqBody.userId && !reqBody.role){
                throw new AppError("Please Provide Complete Data" , 400);
            }

            await userService.ChangeUserRole(reqBody.userId , reqBody.role , req , res);
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
        appResponse = new AppResponse();
        await dbconn();
      const {userId, name, email, associated_with, correspondence_address, mobile_no } = await req.json();
  
      // Update the User model fields
      await userService.Update(
        { _id: userId }, 
        { 
          $set: {
            name: name, 
            email: email, 
            mobile_no: mobile_no,
            associated_with: associated_with
          }
        }
      );
  
      // Update the Employee model fields
      await employeeService.Update(
        { user_id: userId }, 
        { 
          $set: {
            correspondence_address: correspondence_address
          }
        }
      );

      appResponse.status = true;    
      appResponse.message = "User and employee details updated successfully";

      return Response.json(appResponse.getResponse(),{status:200});
  
    } catch (error) {
      appResponse = new AppResponse();
      appResponse.status = false;
      appResponse.message = error.message;
      appResponse.error = {message:"Error while updating user"};
      if(error instanceof AppError){
        return Response.json(appResponse.getResponse(),{status:error.statusCode});
      }
      return Response.json(appResponse.getResponse(),{status:500});
    }
  }
  