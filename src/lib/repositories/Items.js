import hardwareModel from "@/modal/hardware";
import { Base } from "./Base";
import softwareModel from "@/modal/software";

export class Hardware extends Base{
    constructor(){
        super(hardwareModel);
    }
}
export class Software extends Base{
    constructor(model){
        super(softwareModel);
    }
}