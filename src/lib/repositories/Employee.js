import { Base } from "./Base";
import employeeModel from "@/modal/employee";

export class Employee extends Base{
    constructor(){
        super(employeeModel);
    }
}