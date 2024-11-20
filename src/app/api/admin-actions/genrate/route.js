import { isUserAuthenticated } from '@/lib/helper/ValidateUser';
import { sendDocument } from '@/lib/resend';
import axios from 'axios';
import ejs from 'ejs';
import path from 'path';


const url = process.env.PDF_API;
export async function POST(req, res) {
    try {
        const authenticatedUser = await isUserAuthenticated(req, res);

        if (!authenticatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "You are not logged in to perform this action",
                },
                { status: 401 }
            );
        }

        if (authenticatedUser.role === "user") {
            return Response.json({
                success: false,
                message: 'You are not authorized to perform this action',
            }, { status: 403 });
        }

        const { action, documentType, formData, requestId } = await req.json();

        if (!requestId) {
            return Response.json(
                {
                    success: false,
                    message: "No request ID found",
                },
                { status: 400 }
            );
        }

        const template = templates[documentType];
        const html = await new Promise((resolve, reject) => {
            ejs.renderFile(template.content_template, formData, (err, html) => {
                if (err) reject(err);
                resolve(html);
            });
        });

        const response = await axios.post(url, {
            html,
        }, { responseType: 'arraybuffer' });


        const pdfBuffer = response.data;
        console.log("this is pdf", pdfBuffer);


        if (action === 'preview') {
            return new Response(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });
        } else if (action === 'send') {

            const message = await sendDocument(documentType, formData.email, pdfBuffer);

            if (!message.sucess) {
                return Response.json(
                    {
                        success: false,
                        message: "Email not sent",
                    },
                    { status: 400 }
                );
            }

            return Response.json(
                {
                    success: true,
                    message: "Email sent successfully",
                },
                { status: 200 }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid action specified",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.log(error);

        return Response.json({ success: false, message: error, }, { status: 500 });
    }
}

export const templates = {
    experienceLetter: {
        document_title: "Experience Letter",
        content_template: path.join(process.cwd(), 'src', 'template', 'Experience-letter.ejs'),
    },
    AppoinmentLetter: {
        document_title: "Appointment Letter",
        content_template: path.join(process.cwd(), 'src', 'template', 'AppoinmentLetter.ejs'),
    },
    JoiningLetter: {
        document_title: "Joining  Letter",
        content_template: path.join(process.cwd(), 'src', 'template', 'JoiningLetter.ejs'),
    },
};
