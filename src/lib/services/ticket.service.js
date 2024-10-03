import { isUserAuthenticated } from "../helper/ValidateUser";
import { BaseService } from "./base.service";

export class TicketService extends BaseService{
    #repository;
    #serviceLocator;
    constructor(repository,serviceLocator) {
        super(repository);
        this.#repository = repository;
        this.#serviceLocator = serviceLocator;
    }

    async Create(data , req , res){
        const sessionUser = await isUserAuthenticated(req,res);
        const created_item = await this.#repository.Create(data);
        if(created_item){
            await this.#serviceLocator.AddTicket(sessionUser?.id , created_item._id);
        }
        return created_item;
    }
}