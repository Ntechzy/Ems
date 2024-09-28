import { BaseService } from "./base.service";

export class BirthDayService extends BaseService{
    #repository;
    constructor(repository){
        super(repository);
        this.#repository = repository;
    }
}