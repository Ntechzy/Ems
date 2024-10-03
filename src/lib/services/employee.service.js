import { AppError } from "../errors/AppError";
import { isUserAuthenticated } from "../helper/ValidateUser";
import { BaseService } from "./base.service";

export class EmployeeService extends BaseService{
    #repository;
    constructor(repository){
        super(repository);
        this.#repository = repository;
    }

    async GetById(userId, req , res) {
        const sessionUser = await isUserAuthenticated(req , res);
        if((userId != sessionUser.id )&& sessionUser.role == "user"){
            throw new AppError("You are not allowed to access this resource" , 401);
        }else{
            const item = await this.#repository.Get({user_id : userId});
            return item;
        }
    }
}