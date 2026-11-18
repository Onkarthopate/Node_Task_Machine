import { EventEmitter } from "events";
import { sendMail } from "./sendMail.js";

export const jobEmitter = new EventEmitter();

jobEmitter.on("job:applied", async ({ candidate, recruiter, jobDetails }) => {
    try {
        const results = await Promise.allSettled([
            sendMail({
                to: candidate.email,
                subject: "Job Application Submitted Successfully",
                html: `
                <h2>Application Submitted Successfully!</h2>
                <p>Hello ${candidate.username},</p>
                <p>Your application has been submitted successfully.</p>
                <p><strong>Job:</strong> ${jobDetails.title}</p>
                <p><strong>Role:</strong> ${jobDetails.jobRole}</p>
                <p><strong>Status:</strong> APPLIED</p>
                <p>Best of luck with your application!</p>
                `
            }),
            sendMail({
                to: recruiter.email,
                subject: "New Job Application Received",
                html: `
                <h2>New Job Application</h2>
                <p>Hello ${recruiter.username},</p>
                <p>A candidate has applied for your job posting.</p>
                <p><strong>Candidate:</strong> ${candidate.username}</p>
                <p><strong>Email:</strong> ${candidate.email}</p>
                <p><strong>Job:</strong> ${jobDetails.title}</p>
                <p><strong>Role:</strong> ${jobDetails.jobRole}</p>
                <p>Please log in to your portal to review the application.</p>
                `
            })
        ]);

        results.forEach((res, index) => {
            const recipient = index === 0 ? "Candidate" : "Recruiter";
            if (res.status === "rejected") {
                console.error(`[Email Error] Failed to send email to ${recipient}:`, res.reason);
            } else {
                console.log(`[Email Success] Email sent successfully to ${recipient}`);
            }
        });
    } catch (err) {
        console.error("[Email Error] Unexpected failure in job:applied listener:", err);
    }
});
