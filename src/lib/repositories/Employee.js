import { Base } from "./Base";
import employeeModel from "@/modal/employee";

export class Employee extends Base{
    #modelName;
    constructor(){
        super(employeeModel);
        this.#modelName = employeeModel;
    }

    async Get(filter){ 
        const res = await this.#modelName.findOne(filter).populate({
            path:"user_id",
            populate:{path:"department"}
        }).populate("alloted_hardwares").populate("alloted_softwares").populate("dob");
        return res;
    }

    async GetWithPagination(filter , offset , limit){
        const res = await this.#modelName.find(filter).populate({
            path:"user_id",
            populate:{path:"department"}
        }).skip(offset).limit(limit);
        return res;
    }
}