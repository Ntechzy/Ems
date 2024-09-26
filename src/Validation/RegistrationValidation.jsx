import * as Yup from 'yup'
export const RegistrationValidate = Yup.object({

    employee_id: Yup.string().required("employee_id is required"),

    name: Yup.string().required("name is required"),

    email: Yup.string().email("Invalid email adress").required("Email is required"),

    mobile_no: Yup.string().required('* mobile_no is required').required("* Enter Your mobile_no").matches(/^\d{10}$/, "* mobile_no  should be of 10 digit"),

    location: Yup.string().required("location address is required"),

});
