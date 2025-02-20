import { Base } from "./Base";
import BirthDayModel from '../../modal/birthday'

export class BirthDay extends Base {
    #modelName;
    constructor() {
        super(BirthDayModel)
        this.#modelName = BirthDayModel;
    }

    async Update(filter, dataToUpdate) {
        const res = await this.#modelName.findOneAndUpdate(filter, dataToUpdate, { upsert: true, new: true });
        return res;
    }

    async GetAllTodayBirthdays() {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        const todayBirthdays = await this.#modelName.aggregate([
            {
                $project: {
                    month: { $month: "$date" },
                    day: { $dayOfMonth: "$date" },
                    name: 1,
                    date: 1
                }
            },
            {
                $match: {
                    month: currentMonth,
                    day: currentDay
                }
            }
        ]); 

        return todayBirthdays;
    }




}