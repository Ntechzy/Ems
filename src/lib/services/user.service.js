import { isUserAuthenticated, validateRole } from "../helper/ValidateUser";
import { BaseService } from "./base.service";

export class UserService extends BaseService {
    #repository;
    #serviceLocator;
    constructor(repository, serviceLocator) {
        super(repository);
        this.#repository = repository;
        this.#serviceLocator = serviceLocator;
    }

    async ChangeUserRole(userId, roleToUpdate = "admin", req, res) {
        const sessionUser = await isUserAuthenticated(req, res);
        if (validateRole(sessionUser, ["admin", "super_admin"])) {
            const user = await this.#repository.Update({ _id: userId }, { $set: { role: roleToUpdate } });
            if (roleToUpdate == "admin") {
                await this.#serviceLocator.Update(
                    { _id: user.department },
                    { $addToSet: { manager: userId } }
                );

            } else if (roleToUpdate == "user") {
                await this.#serviceLocator.Update(
                    { _id: user.department },
                    { $pull: { manager: userId } }
                );
            }

            return true;
        }
        return false;
    }

}