import dbconn from "@/lib/dbconn";
import { AppError } from "@/lib/errors/AppError";
import { AppResponse } from "@/lib/helper/responseJson";
import {isUserAuthenticated, validateRole} from "@/lib/helper/ValidateUser"
import { User } from "@/lib/repositories/User";
import { UserService } from "@/lib/services/user.service";

const userService = new UserService(new User());
let appResponse;

export async function GET(req,res){
    try {
        appResponse = new AppResponse();
        await dbconn();
        const params = res.params;
        const sessionUser = await isUserAuthenticated(req , res);
        if(sessionUser){
            const userIdArr = params.id;
            if(userIdArr){
                const userId = userIdArr[0];
                const user = await userService.GetById(userId , req , res);
                appResponse.data = user;

            }else if(validateRole(sessionUser,["super_admin","admin"])){
                const all_users = await userService.GetAll();
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