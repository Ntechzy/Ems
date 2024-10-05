import userModel from "@/modal/user";
import { Base } from "./Base";

export class User extends Base{
    #modelName;
    constructor(){
        super(userModel);
        this.#modelName = userModel;
    }

    async GetWithPagination(filter , offset , limit){
        const res = await this.#modelName.find(filter).populate("department").skip(offset).limit(limit);
        return res;
    }
}