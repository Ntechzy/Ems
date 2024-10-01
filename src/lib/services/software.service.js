import { FilterData } from "../helper/FilterData";
import { BaseService } from "./base.service";

export class SoftwareService extends BaseService{
    #repository;
    constructor(repository){
        super(repository);
        this.#repository = repository;
    }
}