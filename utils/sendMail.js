import "dotenv/config";
import nodemailer from "nodemailer";

let transporterInstance = null;

export const getTransporter = () => {
    if (!transporterInstance) {
        transporterInstance = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });
    }
    return transporterInstance;
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
