import dbconn from "@/lib/dbconn";
import { AppError } from "@/lib/errors/AppError";
import { AppResponse } from "@/lib/helper/responseJson";
import {
  Hardware,
  Software,
  Department,
  BirthDay,
  Ticket,
  Employee,
} from "@/lib/repositories";
import {
  BirthDayService,
  DepartmentService,
  EmployeeService,
  HardwareService,
  SoftwareService,
  TicketService,
} from "@/lib/services";
import TicketModel from "@/modal/ticket";

const hardwareRepo = new Hardware();
const hardwareService = new HardwareService(hardwareRepo);
const softwareRepo = new Software();
const softwareService = new SoftwareService(softwareRepo);
const departmentRepo = new Department();
const departmentService = new DepartmentService(departmentRepo);
const birthdayRepo = new BirthDay();
const birthdayService = new BirthDayService(birthdayRepo);
const ticketRepo = new Ticket();
const employeeService = new EmployeeService(new Employee());
const ticketService = new TicketService(ticketRepo, employeeService);

let appResponse;

export async function GET(req, { params }) {
  try {
    appResponse = new AppResponse();
    await dbconn();

    const resourceName = params.resourceName;
    const searchParams = req.nextUrl.searchParams;

    if (resourceName.toLowerCase() == "hardware") {
      let all_hardwares;
      if (searchParams.get("filter")) {
        const searchQuery = searchParams.get("filter");
        all_hardwares = await hardwareService.GetWithFields(searchQuery);
      } else {
        all_hardwares = await hardwareService.GetAll();
      }

      appResponse.data = all_hardwares;

      return Response.json(appResponse.getResponse(), { status: 200 });
    } else if (resourceName.toLowerCase() == "software") {
      let all_softwares;
      if (searchParams.get("filter")) {
        const searchQuery = searchParams.get("filter");
        all_softwares = await softwareService.GetWithFields(searchQuery);
      } else {
        all_softwares = await softwareService.GetAll();
      }
      appResponse.data = all_softwares;

      return Response.json(appResponse.getResponse(), { status: 200 });
    } else if (resourceName.toLowerCase() == "department") {
      const all_departments = await departmentService.GetAll();
      appResponse.data = all_departments;

            return Response.json(appResponse.getResponse(), { status: 200 });
        }


        else if (resourceName.toLowerCase() == "birthday") {
            let date = searchParams.get("date");
            if((new Date(date)) != "Invalid Date"){
                date = new Date(date);
                let month = date.getMonth();
                let day = date.getDate();
                const dates_birthday = await birthdayService.GetAllTodayBirthdays(month , day);
                appResponse.data = dates_birthday;
                return Response.json(appResponse.getResponse(),{status:200});
            }
            const all_birthdays = await birthdayService.GetAll();
            appResponse.data = all_birthdays;

      return Response.json(appResponse.getResponse(), { status: 200 });
    } else if (resourceName.toLowerCase() == "ticket") {
      const all_tickets = await ticketService.GetAll();
      appResponse.data = all_tickets;

      return Response.json(appResponse.getResponse(), { status: 200 });
    } else {
      appResponse.status = false;
      appResponse.message = "No Data for this resource";
      appResponse.error = { message: "This Resource is not allowed" };

      return Response.json(appResponse.getResponse(), {
        status: 400,
      });
    }
  } catch (err) {
    appResponse = new AppResponse();
    console.log("Error While Getting items ", err);
    if (err instanceof AppError) {
      appResponse.message = err.message;
      appResponse.status = false;
      return Response.json(appResponse.getResponse(), {
        status: err.statusCode,
      });
    }

    appResponse.status = false;
    appResponse.message = "Error While Getting Items";
    appResponse.error = { message: err.message };

    return Response.json(appResponse.getResponse(), { status: 500 });
  }
}

export async function POST(req, res) {
  try {
    await dbconn();
    appResponse = new AppResponse();
    const resourceName = res.params.resourceName;
    const reqBody = await req.json();

    if (
      resourceName.toLowerCase() == "hardware" ||
      resourceName.toLowerCase() == "software"
    ) {
      if (!reqBody.name || !reqBody.value) {
        appResponse.status = false;
        appResponse.message = "Please provide all data";

        return Response.json(appResponse.getResponse(), {
          status: 400,
        });
      }

      const data = {
        name: reqBody.name,
        logo: {
          url: "https://placeholder.co/100X100",
          client_id: "someid",
        },
      };

      if (resourceName.toLowerCase() == "hardware") {
        data.value = reqBody.value;
        const resData = await hardwareService.Create(data);
        appResponse.status = true;
        appResponse.message = "Successfully created Hardware";
        appResponse.data = resData;

        return Response.json(appResponse.getResponse(), { status: 201 });
      } else if (resourceName.toLowerCase() == "software") {
        console.log("inside software..");
        data.version = reqBody.value;
        const resData = await softwareService.Create(data);

        appResponse.status = true;
        appResponse.message = "Successfully created Software";
        appResponse.data = resData;

        return Response.json(appResponse.getResponse(), { status: 201 });
      }
    } else if (resourceName.toLowerCase() == "ticket") {
      const resData = await ticketService.Create(reqBody, req, res);

      appResponse.status = true;
      appResponse.message = "Successfully created Ticket";
      appResponse.data = resData;

      return Response.json(appResponse.getResponse(), { status: 201 });
    }
  } catch (err) {
    appResponse = new AppResponse();
    appResponse.status = false;
    appResponse.message = "Error While Creating Items";
    appResponse.error = err.message;
    console.log(err);

    return Response.json(appResponse.getResponse(), {
      status: 500,
    });
  }
}
export async function DELETE(req, res) {
  await dbconn();
  try {
    const searchParams = req.nextUrl.searchParams;
    const ticketId = searchParams.get("ticketId");
    if (!ticketId) {
      return Response.json(
        { status: 404, message: "user not found" },
        { status: 404 }
      );
    }
    const ticket = await ticketService.Delete(ticketId);
    if (!ticket) {
      return Response.json(
        { status: 404, message: "ticket not found" },
        { status: 404 }
      );
    }

    return Response.json({
      status: 200,
      message: "ticket deleted successfully",
    },{status:200});
  } catch (err) {
    return Response.json(
      { status: 500, message: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, res) {
  try {
    await dbconn();
    appResponse = new AppResponse();
    const resourceName = res.params.resourceName;
    if (resourceName == "user") {
    }
  } catch (err) {
    appResponse = new AppResponse();
    appResponse.status = false;
    appResponse.message = "Error While Updating Items";
    appResponse.error = err.message;

    return Response.json(appResponse.getResponse(), {
      status: 500,
    });
  }
}
