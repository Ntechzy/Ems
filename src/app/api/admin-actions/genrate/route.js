import dbconn from '@/lib/dbconn';
import { isUserAuthenticated } from '@/lib/helper/ValidateUser';
import { sendDocument } from '@/lib/resend';
import ejs from 'ejs';
import path from 'path';
import puppeteer from 'puppeteer';
export async function POST(req, res) {

    try {
        const authenticatedUser = await isUserAuthenticated(req, res);

        if (!authenticatedUser) {
            return Response.json(
                {
                    sucess: false,
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
                    sucess: false,
                    message: "No request id found",
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

        const browser = await puppeteer.launch({
            headless: true,  // Run in headless mode (necessary for serverless)
            executablePath: '/usr/bin/chromium',  // Path to Chromium (may need to be adjusted)
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--single-process',
                '--disable-gpu'
            ]
        });
        const page = await browser.newPage();
        await page.setContent(html);

        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();


        if (action == 'preview') {

            return new Response(pdfBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'inline; filename="generated-document.pdf"',
                },
            });

        }

        if (action === 'confirm') {
            const message = await sendDocument(documentType, formData.email, pdfBuffer)


            if (!message.sucess) {
                return Response.json(
                    {
                        sucess: false,
                        message: "Warning not sent",
                    },
                    { status: 400 }
                );
            }


            return Response.json(
                {
                    sucess: true,
                    message: "Email sent successfully"
                }
                , { status: 200 })
        }


    } catch (error) {
        console.log(error);

        return Response.json({ sucess: true, message: "Something went wrong" }, { status: 500 })
    }
}


export const templates = {

    experienceLetter: {
        document_title: "Experience Letter",
        content_template: path.join(process.cwd(), 'src', 'template', 'Experience-letter.ejs'),
    },
    AppoinmentLetter: {
        document_title: "Appoinment Letter",
        content_template: path.join(process.cwd(), 'src', 'template', 'AppoinmentLetter.ejs'),

    },
};
