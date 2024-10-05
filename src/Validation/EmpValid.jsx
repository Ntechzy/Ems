import * as Yup from 'yup';
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


export const moreDetailsSchema = Yup.object({
  pan_card_no: Yup.string().required("PAN Card number is required"),
  aadhaar_no: Yup.string().required("Aadhaar number is required"),
  salary_slot: Yup.string().required("Salary Slot is required"),
  highest_qualification: Yup.string().required("Highest qualification is required"),
  date_of_joining: Yup.date()
    .test("date_of_joining", "Date of joining is required", (value) => {
      return value !== "";
    }),

  account_holder_name: Yup.string().required("Account holder name is required"),
  bank_name: Yup.string().required("Bank name is required"),
  ifsc_code: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code format")
    .required("IFSC Code is required"),
  account_number: Yup.string()
    .matches(/^[0-9]{9,18}$/, "Account number should be between 9 and 18 digits")
    .required("Account number is required"),
});

