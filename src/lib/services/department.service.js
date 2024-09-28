import { BaseService } from "./base.service";

export class DepartmentService extends BaseService{
    #repository;
    constructor(repository){
        super(repository);
        this.#repository = repository;
    }
}