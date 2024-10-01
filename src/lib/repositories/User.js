import userModel from "@/modal/user";
import { Base } from "./Base";

export class User extends Base{
    constructor(){
        super(userModel);
    }
}