import { Resend } from 'resend';
import { OnBoarding } from '../../email/Onboarding';

const resend = new Resend(process.env.API_KEY);

export const sendOnboarding = async (name, email, employee_id, password, link) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
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