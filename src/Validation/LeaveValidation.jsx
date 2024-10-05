import * as Yup from 'yup';

export const leaveValidation = Yup.object().shape({
    leaveType: Yup.string().required('Please select a leave type'),
    startDate: Yup.date()
        .required('Please select a start date')
        .nullable(),
    endDate: Yup.date()
        .required('Please select an end date')
        .nullable()
        .min(Yup.ref('startDate'), 'End date cannot be before start date'),
    reason: Yup.string().required('Please provide a reason for the leave')
});