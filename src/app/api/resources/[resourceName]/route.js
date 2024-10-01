import dbconn from "@/lib/dbconn";
import { AppError } from "@/lib/errors/AppError";
import { AppResponse } from "@/lib/helper/responseJson";
import { Hardware, Software,Department, BirthDay, Ticket } from "@/lib/repositories";
import { BirthDayService, DepartmentService, HardwareService, SoftwareService, TicketService } from "@/lib/services";

const hardwareRepo = new Hardware();
const hardwareService = new HardwareService(hardwareRepo);
const softwareRepo = new Software();
const softwareService = new SoftwareService(softwareRepo);
const departmentRepo = new Department();
const departmentService = new DepartmentService(departmentRepo);
const birthdayRepo = new BirthDay();
const birthdayService = new BirthDayService(birthdayRepo);
const ticketRepo = new Ticket();
const ticketService = new TicketService(ticketRepo);

let appResponse;

export async function GET(req, { params }) {
    try {
        appResponse = new AppResponse();
        await dbconn();
        const resourceName = params.resourceName;
        const searchParams = req.nextUrl.searchParams;

        if (resourceName.toLowerCase() == "hardware") {
            let all_hardwares;
            if(searchParams.get("filter")){
                const searchQuery = searchParams.get("filter");
               all_hardwares = await hardwareService.GetWithFields(searchQuery);
            }else{
                all_hardwares = await hardwareService.GetAll();
            }

            appResponse.data = all_hardwares;

            return Response.json(appResponse.getResponse(),{status:200});
        }


        else if (resourceName.toLowerCase() == "software") {
            let all_softwares; 
            if(searchParams.get("filter")){
                const searchQuery = searchParams.get("filter");
                all_softwares = await softwareService.GetWithFields(searchQuery);
            }else{
                all_softwares = await softwareService.GetAll();
            }
            appResponse.data = all_softwares;

            return Response.json(appResponse.getResponse(),{status:200});
        }


        else if (resourceName.toLowerCase() == "department") {
            
            const all_departments = await departmentService.GetAll();
            appResponse.data = all_departments;

            return Response.json(appResponse.getResponse(),{status:200});
        }


        else if(resourceName.toLowerCase() == "birthday"){
           
            const all_birthdays = await birthdayService.GetAll();
            appResponse.data = all_birthdays;

            return Response.json(appResponse.getResponse(),{status:200});
        }


        else if(resourceName.toLowerCase() == "ticket"){
          
            const all_tickets = await ticketService.GetAll();
            appResponse.data = all_tickets;

            return Response.json(appResponse.getResponse(),{status:200});
        }


        else {
            appResponse.status = false;
            appResponse.message = "No Data for this resource";
            appResponse.error = {message:"This Resource is not allowed"};

            return Response.json(appResponse.getResponse(), {
                status: 400
            })
        }


    } catch (err) {
        appResponse = new AppResponse();
        console.log("Error While Getting items ", err)
        if(err instanceof AppError){
            appResponse.message = err.message;
            appResponse.status = false;
            return Response.json(appResponse.getResponse(),{status:err.statusCode});
        }

        appResponse.status = false;
        appResponse.message = "Error While Getting Items";
        appResponse.error = {message:err.message};

        return Response.json(appResponse.getResponse(),{status: 500});
    }
}



export async function POST(req, { params }) {
    try {
        appResponse = new AppResponse();
        const resourceName = params.resourceName;
        const reqBody = await req.json();

        if (!reqBody.name || !reqBody.value) {
            appResponse.status = false;
            appResponse.message = "Please provide all data";

            return Response.json(appResponse.getResponse(), {
                status: 400
            })
        }


        const data = {
            name: reqBody.name,
            logo: {
                url: "https://placeholder.co/100X100",
                client_id: "someid"
            }
        }


        if (resourceName.toLowerCase() == "hardware") {
         
            data.value = reqBody.value;
            const resData = await hardwareService.Create(data);
            appResponse.status = true;
            appResponse.message = "Successfully created Hardware";
            appResponse.data = resData;

            return Response.json(appResponse.getResponse(), { status: 201 })
        } 
        
        else if (resourceName.toLowerCase() == "software") {
            console.log("inside software..")
            data.version = reqBody.value;
            const resData = await softwareService.Create(data);

            appResponse.status = true;
            appResponse.message = "Successfully created Software";
            appResponse.data = resData;

            return Response.json(appResponse.getResponse(), { status: 201 })
        }

        appResponse.status = false;
        appResponse.message = "Wrong Input";

        return Response.json(appResponse.getResponse(), { status: 400 })


    } catch (err) {
        appResponse = new AppResponse();
        appResponse.status = false;
        appResponse.message = "Error While Creating Items";
        appResponse.error = err.message;

        return Response.json(appResponse.getResponse(),
            {
                status: 500,
            }
        )
    }
}