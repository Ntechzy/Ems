import { FilterData } from "../helper/FilterData";

export class BaseService {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }

    async Create(data){
        const created_item = await this.#repository.Create(data);
        return created_item;
    }

    async GetAll() {
        const all_items = await this.#repository.GetAll();
        return all_items;

    }

    async GetWithFields(fields){
        let all_items = await this.#repository.GetAll();
        const filterClass = new FilterData(all_items);
        all_items = filterClass.filterByFields(fields);
        return all_items; 
    }

    async Get(filter) {
        const item = await this.#repository.Get(filter);
        return item;
    }

    async Delete(id){
        const deleted_item = await this.#repository.Delete(id);
        return deleted_item;
    }
}