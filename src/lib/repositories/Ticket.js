import { Base } from "./Base";
import TicketModel from "@/modal/ticket";

export class Ticket extends Base{
    constructor(){
        super(TicketModel);
    }
}