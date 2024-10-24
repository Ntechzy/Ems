import { Resend } from 'resend';
import { OnBoarding } from '../../email/Onboarding';
import { Updatepassword } from '../../email/Updatepassword';
import { LeaveRequestEmail } from '../../email/Leave';


const resend = new Resend(process.env.API_KEY);

export const sendOnboarding = async (name, email, employee_id, password, link) => {
    try {
        await resend.emails.send({
            from: 'onboarding@ems.ntechzy.in',
            to: email,
            subject: 'Onboading: Welcome To Ntechzy',
            react: OnBoarding({ name, email, employee_id, password, link })
        });
        return {
            sucess: true,
            message: "Email for onboarding sent sucessfully ! "
        }
    } catch (error) {
        console.log(error);

        return {
            sucess: false,
            message: "Unable to send Onboarding mail ! try again later "

        }
    }
}

export const resetMail = async (name, email, link) => {
    try {
        await resend.emails.send({
            from: 'admin@ems.ntechzy.in',
            to: email,
            subject: 'Update your account to password Ntechzy Portal',
            react: Updatepassword({ name, link })
        });
        return {
            sucess: true,
            message: "Email for password change sent sucessfully ! "
        }
    } catch (error) {
        console.log(error);

        return {
            sucess: false,
            message: "Unable to send password change mail ! try again later "
        }
    }
}


export const leaveMail = async (name, email, leaveType, leaveFrom, leaveTo, reason) => {
    try {
        await resend.emails.send({
            from: 'admin@ems.ntechzy.in',
            to: email,
            subject: `${name} :- Asking For ${leaveType} Leave `,
            react: LeaveRequestEmail({ name, leaveType, leaveFrom, leaveTo, reason })
        });
        return {
            sucess: true,
            message: "Email for password change sent sucessfully ! "
        }
    } catch (error) {
        return {
            sucess: false,
            message: "Unable to send leave Request for now ! try again later ",
            error
        }
    }
} 