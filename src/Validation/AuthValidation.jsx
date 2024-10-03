import * as Yup from 'yup'
export const RegistrationValidate = Yup.object({
    name: Yup.string().required("name is required"),

    salary: Yup.number().required("salary is required"),

    interview_done_by: Yup.string().required("interview_done_by is required"),

    who_finalize_salary: Yup.string().required("interview_done_by is required"),

    email: Yup.string().email("Invalid email adress").required("Email is required"),

    mobile_no: Yup.string().required('* mobile_no is required').required("* Enter Your mobile_no").matches(/^\d{10}$/, "* mobile_no  should be of 10 digit"),

    password: Yup.string().required('* Password is required'),

    alloted_hardwares: Yup.array()
        .min(1, "At least one hardware must be allocated")
        .of(Yup.string()),
    alloted_softwares: Yup.array()
        .min(1, "At least one software must be allocated")
        .of(Yup.string()),

    associated_with: Yup.string()
        .required("Associated with is required"),

});


export const sinInValidate = Yup.object({

    username: Yup.string().required("* employee id is required"),

    password: Yup.string().required("* Enter Your password"),

}) 