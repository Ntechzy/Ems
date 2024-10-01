import dbconn from "@/lib/dbconn";
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

export async function GET(req, { params }) {
    try {
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
            return Response.json({
                success: true,
                message: "Data Fetched Successfully",
                data: all_hardwares
            })
        }


        else if (resourceName.toLowerCase() == "software") {
            let all_softwares; 
            if(searchParams.get("filter")){
                const searchQuery = searchParams.get("filter");
                all_softwares = await softwareService.GetWithFields(searchQuery);
            }else{
                all_softwares = await softwareService.GetAll();
            }
            return Response.json({
                success: true,
                message: "Data Fetched Successfully",
                data: all_softwares
            })
        }


        else if (resourceName.toLowerCase() == "department") {
            
            const all_departments = await departmentService.GetAll();
            return Response.json({
                success: true,
                message: "Data Fetched Successfully",
                data: all_departments
            })
        }


        else if(resourceName.toLowerCase() == "birthday"){
           
            const all_birthdays = await birthdayService.GetAll();
            return Response.json({
                success: true,
                message: "Data Fetched Successfully",
                data: all_birthdays
            })
        }


        else if(resourceName.toLowerCase() == "ticket"){
          
            const all_tickets = await ticketService.GetAll();
            return Response.json({
                success: true,
                message: "Data Fetched Successfully",
                data: all_tickets
            })
        }


        else {
            return Response.json({
                success: false,
                message: "Some Error Occurred",
            }, {
                status: 400
            })
        }


    } catch (err) {

        console.log("Error While Getting items ", err)
        return Response.json(
            {
                sucess: false,
                message: "Error While Getting Items",
                error: err.message

            },
            {
                status: 500,
            }
        )
    }
}



export async function POST(req, { params }) {
    try {
        const resourceName = params.resourceName;
        const reqBody = await req.json();
        
        if (!reqBody.name || !reqBody.value) {
            return Response.json({
                message: "Please provide all data"
            }, {
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
            console.log("inside hardware..")
            data.value = reqBody.value;
            const resData = await hardwareService.Create(data);
            return Response.json({
                status: "Success",
                message: "Successfully created Software",
                data: resData
            }, { status: 201 })
        } 
        
        else if (resourceName.toLowerCase() == "software") {
            console.log("inside software..")
            data.version = reqBody.value;
            const resData = await softwareService.Create(data);
            return Response.json({
                status: "Success",
                message: "Successfully created Software",
                data: resData
            }, { status: 201 })
        }

        return Response.json({
            message: "Wrong Input",
        }, { status: 400 })


    } catch (err) {

        return Response.json(
            {
                sucess: false,
                message: "Error While Creating Items",
                error: err.message

            },
            {
                status: 500,
            }
        )
    }
}