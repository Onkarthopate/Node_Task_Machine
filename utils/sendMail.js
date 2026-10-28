import "dotenv/config";
import nodemailer from "nodemailer";

const getTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });
};

export const sendMail = async ({ to, subject, html }) => {
    const transporter = getTransporter();
    return await transporter.sendMail({
        from: `"Job Portal" <${process.env.EMAIL}>`,
        to,
        subject,
        html,
    });
};
