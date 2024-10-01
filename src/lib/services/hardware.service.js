import { FilterData } from "../helper/FilterData";
import { BaseService } from "./base.service";

export class HardwareService extends BaseService{
    #repository;
    constructor(repository){
        super(repository);
        this.#repository = repository;
    }
}