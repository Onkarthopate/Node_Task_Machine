import mongoose from "mongoose";
import JobApplicationModel from "../models/JobApplication.js";
import JobModel from "../models/jobModel.js";
import UserModal from "../models/UserAuth.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendMail } from "../utils/sendMail.js";

export const getAllJobs = ErrorHandler(async (req, res, next) => {

    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);

    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0);


    const jobs = await JobModel.find()
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit);

    console.log(jobs);


    const totalJobs = await JobModel.countDocuments();

    return res.status(200).json({
        success: true,
        totalJobs: totalJobs,
        limit,
        offset,
        jobs,
    });
});

export const postJobsByRecruiter = ErrorHandler(async (req, res, next) => {

    console.log("Request Body:", req.body);

    const { title, description, jobRole, recruiterId } = req.body;
    console.log("Recruiter ID:", recruiterId);


    if (!title || !description || !jobRole || !recruiterId) {

        const error = new Error("All field are requied");
        error.statusCode = 400;
        throw error;
    }

    const jobData = await JobModel.findOne({ title: title.trim() });

    if (jobData) {
        const error = new Error("Title of same name already exist");
        error.statusCode = 409;
        throw error;
    }

    const JobDeatils = await JobModel.create({
        title: title.trim(),
        description,
        jobRole,
        recruiterId: recruiterId
    })

    return res.status(201).json({
        success: true,
        message: "Job Created Successfully",
        JobData: JobDeatils,
    })
});

export const deleteJobByAdminOnly = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    console.log(id);


    if (!id) {
        const error = new Error("Job ID is required");
        error.statusCode = 400;
        return error;
    }

    const removeJob = await JobModel.findByIdAndDelete(id);
    console.log(removeJob);

    return res.status(200).json({
        success: false,
        message: "Job Deleted Successfully!",
    });
});


export const ApplyJobByCandidate = ErrorHandler(async (req, res, next) => {

    const { jobId } = req.body;
    console.log("jobId", jobId);

    console.log("mongoose.isValidObjectId(jobId)", mongoose.isValidObjectId(jobId));


    if (!mongoose.isValidObjectId(jobId)) {
        const error = new Error("Job Id is required");
        error.statusCode = 400;
        throw error;
    }

    const candidateId = req.user.id || req.user._id;
    console.log(candidateId);

    if (!candidateId) {
        const error = new Error("Candidate Authentication required");
        error.statusCode = 400;
        throw error;
    }

    const jobDetails = await JobModel.findById({ _id: jobId });
    console.log(jobDetails);

    if (!jobDetails) {
        const error = new Error("Job Application not found with this jobId");
        error.statusCode = 400;
        throw error;
    }

    console.log(candidateId, jobId);

    const isExistApplication = await JobApplicationModel.findOne({
        candidateId, jobId
    });

    if (isExistApplication) {
        const error = new Error("Candidate applied for this job");
        error.statusCode = 400;
        throw error;
    }

    // get candidate and recruiter

    const candidate = await UserModal.findOne({
        _id: candidateId,
        role: "CANDIDATE"
    })

    if (!candidate) {
        const error = new Error("Candidate not found");
        error.statusCode = 404;
        throw error;
    }

    const recruiter = await UserModal.findOne({
        _id: jobDetails.recruiterId,
        role: "RECRUITER"
    })

    if (!recruiter) {
        const error = new Error("Recruiter not found");
        error.statusCode = 404;
        throw error;
    }

    // create application 

    let application;

    try {
        application = await JobApplicationModel.create({
            candidateId,
            jobId
        });

        console.log(application);

    } catch (error) {
        throw error;
    }

    console.log("candidate", candidate);
    console.log("recruiter", recruiter);


    const emailTemplate = await Promise.allSettled([
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

    emailTemplate.map((res, index) => {
        console.log(res);

        if (res.status === "rejected") {
            console.error(
                `Application email ${index + 1} failed:`,
                res.reason
            );
        }
    });


    return res.status(201).json({
        success: true,
        message: "Job Applied successfully",
        application,
        emailStatus: {
            candidate: emailTemplate[0].status,
            recruiter: emailTemplate[1].status,
        },
    });
})

export const getMyAppliedJobs = ErrorHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);

    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0);

    const candidateId = req.user.id || req.user._id;
    // console.log("candidateId : " , candidateId);

    const myAppliedJob = await JobApplicationModel.find({ candidateId })
        .sort({ AppliedAt: -1 })
        .skip(offset)
        .limit(limit)
        ;

    if (!myAppliedJob) {
        const error = new Error("candidate not found with this ID");
        error.statusCode = 400;
        throw error;
    }

    console.log(myAppliedJob);

    const jobIds = myAppliedJob.map(application => application.jobId);
    console.log(jobIds);

    const AllJobs = await JobModel.find({
        _id: { $in: jobIds }
    });

    console.log(AllJobs);

    return res.status(200).json({
        success: true,
        message: "All Jobs get sucessfully",
        limit: limit,
        offset: offset,
        totalJobs: AllJobs.length,
        AllJobs,
    })
})


