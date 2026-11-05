import mongoose from "mongoose";
import JobApplicationModel from "../models/JobApplication.js";
import JobModel from "../models/jobModel.js";
import UserModal from "../models/UserAuth.js";
import CustomError from "../utils/CustomError.js"
import { SuccessResponce } from "../utils/responseHandler.js";
import { sendMail } from "../utils/sendMail.js";
export const getAllJobsService = async ({ limit, offset }) => {
    const jobs = await JobModel.find()
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit);

    const totalJobs = await JobModel.countDocuments();

    return { jobs, totalJobs }
}

export const getAllJobsBySpecificRecruiterService = async ({ id, limit, offset }) => {

    const getJobByRecruiter = await JobModel.find({ recruiterId: id })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

    const totalCount = await JobModel.countDocuments({ recruiterId: id });

    return { getJobByRecruiter, totalCount };

}

export const postJobsByRecruiterService = async ({ id, title, description, jobRole }) => {

    const jobData = await JobModel.findOne({ title: title.trim() });

    if (jobData) {
        throw new CustomError("Job Title already exist")
    }

    const JobDeatils = await JobModel.create({
        title: title.trim(),
        description,
        jobRole,
        recruiterId: id
    });

    return JobDeatils;
}

export const deleteJobByAdminOnlyService = async (id) => {

    const jobId = await JobModel.findById({ _id: id });

    if (!jobId) {
        throw new CustomError("job is already deleted");
    }
    const removeJob = await JobModel.findByIdAndDelete(jobId);
    return removeJob;
}

export const getMyAppliedJobsService = async (id, limit, offset) => {

    const myAppliedJob = await JobApplicationModel.find({ candidateId: id })
        .sort({ AppliedAt: -1 })
        .skip(offset)
        .limit(limit);

    if (!myAppliedJob) {
        throw new CustomError("candidate not found with this ID");
    }

    const jobIds = myAppliedJob.map(application => application.jobId);

    const totalCount = await JobApplicationModel.countDocuments({
        candidateId: id
    });

    const AllJobs = await JobModel.find({
        _id: { $in: jobIds }
    });

    return { AllJobs, totalCount }
}

export const getJobsByCandidateService = async (id, limit, offset) => {
    const candidateIds = Array.isArray(id) ? id : id ? [id] : [];

    const isValidIds = candidateIds.some(id => !mongoose.isValidObjectId(id));

    if (candidateIds.length === 0 || isValidIds) {
        throw new CustomError("Candidate ID(s) is required");
    }

    const candidateAppliedJob = await JobApplicationModel.find({ candidateId: { $in: candidateIds } })
        .sort({ createdAt: -1 })
        .populate("candidateId", "username email");

    const JobIds = [...new Set(candidateAppliedJob.filter(application => application.jobId)
        .map(application => application.jobId.toString()))];

    console.log(JobIds);


    const totalJobs = await JobModel.countDocuments({ _id: { $in: JobIds } })

    if (JobIds.length === 0) {
        return {
            jobs: [],
            totalJobs: 0
        };
    }

    const jobs = await JobModel.find({
        _id: { $in: JobIds }
    }).sort({ createdAt: -1 }).skip(offset).limit(limit);

    console.log(jobs);


    return { jobs, totalJobs }
}

export const getJobApplyCandidateForRecruiterService = async (id, limit, offset) => {
    const recruiterJobs = await JobModel.find({ recruiterId: id });

    const jobIds = recruiterJobs.map(job => job._id);

    if (jobIds.length === 0) {
        return {
            totalApplications: 0,
            applicants: []
        };
    }

    const totalApplications = await JobApplicationModel.countDocuments({
        jobId: { $in: jobIds }
    });

    const applicants = await JobApplicationModel.find({
        jobId: { $in: jobIds }
    })
        .populate("candidateId", "username email")
        .populate("jobId", "title description jobRole")
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit);

    return { applicants, totalApplications }
}

export const ApplyJobByCandidateService = async (jobId, candidateId) => {
  
    if (!mongoose.isValidObjectId(jobId)) {
        throw new CustomError("Job Id is required")
    }
    const jobDetails = await JobModel.findById({ _id: jobId });

    if (!jobDetails) {
        throw new CustomError("Job Application not found with this jobId");
    }

    const isExistApplication = await JobApplicationModel.findOne({
        candidateId, jobId
    });

    if (isExistApplication) {
        throw new CustomError("Candidate already applied for this job");
    }

    const candidate = await UserModal.findOne({
        _id: candidateId,
        role: "CANDIDATE"
    })

    if (!candidate) {
        throw new CustomError("Candidate not found");
    }

    const recruiter = await UserModal.findOne({
        _id: jobDetails.recruiterId,
        role: "RECRUITER"
    })

    if (!recruiter) {
        throw new CustomError("recruiter not found");
    }

    let application;

    try {
        application = await JobApplicationModel.create({
            candidateId,
            jobId
        });

    } catch (error) {
        throw error;
    }

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

    return {
        application,
        emailStatus: {
            candidate: emailTemplate[0].status,
            recruiter: emailTemplate[1].status,
        },
    }

}

