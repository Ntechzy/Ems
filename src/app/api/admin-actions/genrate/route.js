import { sendDocument } from '@/lib/resend';
import ejs from 'ejs';
import path from 'path';
import puppeteer from 'puppeteer';
const tempStorage = {};
export async function POST(req) {

    try {
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

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);

        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();


        if (action == 'preview') {
            tempStorage[requestId] = { pdfBuffer, formData, documentType };

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
