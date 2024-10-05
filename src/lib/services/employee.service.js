import { decrypt } from "../encrypt";
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
            item.pan_card_no = decrypt(item?.pan_card_no);
            console.log(item.pan_card_no , "this is pan card")
            item.aadhaar_no = decrypt(item?.aadhaar_no);
            item.account_holder_name = decrypt(item?.account_holder_name);
            item.bank_name = decrypt(item?.bank_name);
            item.ifsc_code = decrypt(item?.ifsc_code);
            item.account_number = decrypt(item?.account_number);
            return item;
        }
    }

    async AddTicket(userId,ticket){
        const res = await this.#repository.Update({user_id:userId} , {$push:{tickets:ticket}});
        return res;
    }
}