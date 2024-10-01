import { BaseService } from "./base.service";

export class UserService extends BaseService{
    #repository;
    constructor(repository){
        super(repository);
        this.#repository = repository;
    }
}