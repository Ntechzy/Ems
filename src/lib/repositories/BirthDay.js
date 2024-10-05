import { Base } from "./Base";
import BirthDayModel from '../../modal/birthday'

export class BirthDay extends Base{
    #modelName;
    constructor(){
        super(BirthDayModel)
        this.#modelName = BirthDayModel;
    }

    async Update(filter , dataToUpdate){
        const res = await this.#modelName.findOneAndUpdate(filter , dataToUpdate , {upsert:true,new:true});
        return res;
    }
}