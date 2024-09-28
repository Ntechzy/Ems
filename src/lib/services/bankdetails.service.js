import { BaseService } from "./base.service";

export class BankDetailsService extends BaseService{
    #repository;
    constructor(repository){
        super(repository);
        this.#repository = repository;
    }
}