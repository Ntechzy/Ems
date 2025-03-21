export const documentFields = {
    experienceLetter: [
        { label: "Name", name: "name", type: "text" },
        { label: "Email", name: "email", type: "email" },
        {
            label: "Company",
            name: "company",
            type: "select",
            options: ["NTechzy Pvt. Limited", "Careerkick Services"]
        },
        { label: "Position", name: "position", type: "text" },
        { label: "From", name: "from", type: "date" },
        { label: "To", name: "to", type: "date" },
    ],
    AppoinmentLetter: [
        { label: "Name", name: "employeeName", type: "text" },
        { label: "Email", name: "email", type: "email" },
        {
            label: "Company",
            name: "company",
            type: "select",
            options: ["NTechzy Pvt. Limited", "Careerkick Services"]
        },
        { label: "Company Address", name: "companyAddress", type: "text" },
        { label: "Job Title", name: "jobTitle", type: "text" },
        { label: "Department", name: "departmentName", type: "text" },
        { label: "Start Date", name: "startDate", type: "date" },
        { label: "Paid Time Off", name: "paidDaysOff", type: "number" },
        { label: "Tenure Bond", name: "bondYears", type: "number" },
        { label: "Bond Amount", name: "bondAmount", type: "number" },
        { label: "Notice Period", name: "noticePeriod", type: "number" },
    ],
    JoiningLetter: [
        { label: "Name", name: "name", type: "text" },
        { label: "Email", name: "email", type: "email" },
        {
            label: "Company",
            name: "company",
            type: "select",
            options: ["NTechzy Pvt. Limited", "Careerkick Services"]
        },
        { label: "Position", name: "position", type: "text" },
        { label: "From", name: "startDate", type: "date" },
        { label: "salary", name: "salary", type: "number" },
        { label: "Probation Period", name: "probationPeriod", type: "number" },
    ],
};
