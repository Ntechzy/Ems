import { isUserAuthenticated, validateRole } from "../helper/ValidateUser";
import { BaseService } from "./base.service";

export class UserService extends BaseService{
    #repository;
    constructor(repository){
        super(repository);
        this.#repository = repository;
    }

    async ChangeUserRole(userId,roleToUpdate="admin" , req , res){
        const sessionUser = await isUserAuthenticated(req , res);
        if(validateRole(sessionUser , ["admin","super_admin"])){
            await this.#repository.Update({_id : userId} , {$set:{role:roleToUpdate}});
            return true;
        }
        return false;
    }
}