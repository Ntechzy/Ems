import { BaseService } from "./base.service";

export class BirthDayService extends BaseService {
    #repository;
    #serviceLocator
    constructor(repository, serviceLocator) {
        super(repository);
        this.#repository = repository;
        this.#serviceLocator = serviceLocator;
    }

    async GetAllTodayBirthdays(month, day) { 

        return await this.#repository.GetAllTodayBirthdays(month, day);
    }

    async AddAndUpdateDOB(data) {
        const res = await this.#repository.Update({ userId: data.userId }, { $set: data });
        if (res._id) {
            await this.#serviceLocator.Update({ user_id: data.userId }, { $set: { dob: res._id } });
        }
        return res;
    }
}