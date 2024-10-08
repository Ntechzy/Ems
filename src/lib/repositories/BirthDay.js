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

    async GetAllTodayBirthdays() {
        const today = new Date();
    
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
        const todayBirthdays = await this.#modelName.find({
            date: {
                $gte: startOfDay,
                $lt: endOfDay    
            }
        });
    
        return todayBirthdays;
    }
    


}