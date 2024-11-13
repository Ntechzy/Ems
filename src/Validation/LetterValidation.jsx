import * as Yup from 'yup';

export const documentValidationSchemas = {
    experienceLetter: Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .matches(/^[a-zA-Z\s]+$/, "Name should contain only letters"),
        company: Yup.string()
            .oneOf(["Ntechzy", "Career Kick"], "Select a valid company")
            .required("Company is required"),
        position: Yup.string()
            .required("Position is required"),
        from: Yup.date()
            .required("Start date is required")
            .typeError("From must be a valid date"),
        to: Yup.date()
            .required("End date is required")
            .min(Yup.ref('from'), "End date can't be before start date")
            .typeError("To must be a valid date"),
    }),

    AppoinmentLetter: Yup.object().shape({
        employeeName: Yup.string()
            .required("Name is required")
            .matches(/^[a-zA-Z\s]+$/, "Name should contain only letters"),
        company: Yup.string()
            .oneOf(["Ntechzy", "Career Kick"], "Select a valid company")
            .required("Company is required"),
        companyAddress: Yup.string()
            .required("Company address is required"),
        jobTitle: Yup.string()
            .required("Job title is required"),
        departmentName: Yup.string()
            .required("Department name is required"),
        startDate: Yup.date()
            .required("Start date is required")
            .typeError("Start Date must be a valid date"),
        paidDaysOff: Yup.number()
            .required("Paid time off is required")
            .min(0, "Paid time off cannot be negative"),
        bondYears: Yup.number()
            .required("Tenure bond years are required")
            .min(0, "Tenure bond years cannot be negative"),
        bondAmount: Yup.number()
            .required("Bond amount is required")
            .min(0, "Bond amount cannot be negative"),
        noticePeriod: Yup.number()
            .required("Notice period is required")
            .min(0, "Notice period cannot be negative"),
    }),
};
