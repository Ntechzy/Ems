import { BaseService } from "./base.service";

export class TicketService extends BaseService{
    #repository;
    constructor(repository) {
        super(repository);
        this.#repository = repository;
    }
}