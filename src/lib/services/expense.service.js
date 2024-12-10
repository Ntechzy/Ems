import { isUserAuthenticated, validateRole } from "../helper/ValidateUser";
import { BaseService } from "./base.service";

export class ExpenseService extends BaseService {
    #repository;
    #serviceLocator;
    constructor(repository, serviceLocator) {
        super(repository);
        this.#repository = repository;
        this.#serviceLocator = serviceLocator;
    }

    async ChangeExpenseAcess(userId, acessToUpdate, req, res) {
        console.log("here");

        const sessionUser = await isUserAuthenticated(req, res);
        if (validateRole(sessionUser, ["super_admin"])) {
            console.log(acessToUpdate);

            const user = await this.#repository.Update({ _id: userId }, { $set: { expenseAcess: acessToUpdate } });
            console.log(user);

            return true;
        }
        return false;
    }

}
