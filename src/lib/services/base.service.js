import { AppError } from "../errors/AppError";
import { FilterData } from "../helper/FilterData";
import { isUserAuthenticated } from "../helper/ValidateUser";

export class BaseService {
    #repository;
    constructor(repository) {
        this.#repository = repository;
    }

    async Create(data) {
        const created_item = await this.#repository.Create(data);
        return created_item;
    }

    async GetAll() {
        const all_items = await this.#repository.GetAll();
        return all_items;

    }

    async GetAllWithPagination(offset, maxNoOfEntriesToShow) {
        const all_items = await this.#repository.GetWithPagination({}, offset, maxNoOfEntriesToShow);
    

        return all_items;
    }

    async GetWithFields(fields) {
        let all_items = await this.#repository.GetAll();
        const filterClass = new FilterData(all_items);
        all_items = filterClass.filterByFields(fields);
        return all_items;
    }

    async GetById(id, req, res) {
        const sessionUser = await isUserAuthenticated(req, res);
        if ((id != sessionUser.id) && sessionUser.role == "user") {
            throw new AppError("You are not allowed to access this resource", 401);
        } else {
            const item = await this.#repository.Get({ _id: id });
            return item;
        }
    }

    async Delete(id) {
        const deleted_item = await this.#repository.Delete(id);
        return deleted_item;
    }

    async Update(filter, dataToUpdate) {
        const updated_item = await this.#repository.Update(filter, dataToUpdate);
        return updated_item;
    }

    async GetByFilters(filter) {
        const items = await this.#repository.GetByFilters(filter);
        return items;
    }
}