import { object, string, number, date } from "yup";

export const basicDetailsSchema = object({
  permanent_address: string().required("Permanent address is required"),
  correspondence_address: string().required(
    "Correspondence address is required"
  ),
  blood_group: string().required("Blood group is required"),

  marital_status: string().required("Marital status is required"),
  father_name: string().required("Father's name is required"),
  DOB: date()
    .test("DOB", "Date of birth is required", (value) => {
        return value !== "";
    })
  
});

// Schema validation for more details (you can extend this)
export const moreDetailsSchema = object({
  pan_card_no: string().required("PAN Card number is required"),
  aadhaar_no: string().required("Aadhaar number is required"),
  salary_slot: string().required("Salary Slot is required"),
  highest_qualification: string().required("Highest qualification is required"),
  date_of_joining: date()
    .test("date_of_joining", "Date of joining is required", (value) => {
        return value !== "";
    })
});
