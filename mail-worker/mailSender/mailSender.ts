import nodemailer from "nodemailer" 

export default async function mailSender(mailOptions:any){

    await nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }).sendMail(mailOptions)
}