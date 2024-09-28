import { Base } from "./Base";
import DepartmentModel from '@/modal/department';

export class Department extends Base{
    constructor(){
        super(DepartmentModel);
    }
}