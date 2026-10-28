import nodemailer from "nodemailer";
import ErrorHandler from "./ErrorHandler.js";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    }
});

export const sendMail = async ({ to, subject, html }) => {
    return ErrorHandler(async (req, res, next) => {
        return transporter.sendMail({
            from : `"Job Portal" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        })
    })
}