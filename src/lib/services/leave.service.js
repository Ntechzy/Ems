import { BaseService } from "./base.service";

export class LeaveService extends BaseService{
    #repository;
    constructor(repository){
        super(repository);
        this.#repository = repository;
        
    }
}