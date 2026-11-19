import mongoose from "mongoose";
import JobApplicationModel from "../models/JobApplication.js";
import JobModel from "../models/jobModel.js";
import UserModal from "../models/UserAuth.js";
import { ROLES } from "../constants/roles.js";
import CustomError from "../utils/CustomError.js";
import { jobEmitter } from "../utils/jobEvents.js";
import { sendMail } from "../utils/sendMail.js";

export const getAllJobsService = async ({ limit, offset }) => {
    const jobs = await JobModel.find()
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit).lean();

    const totalCount = await JobModel.countDocuments();

    return { jobs, totalCount }
}

export const getAllJobsBySpecificRecruiterService = async ({ id, limit, offset }) => {

    const getJobByRecruiter = await JobModel.find({ recruiterId: id })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit).lean();

    const totalCount = await JobModel.countDocuments({ recruiterId: id });

    return { getJobByRecruiter, totalCount };

}

export const postJobsByRecruiterService = async ({ id, title, description, jobRole }) => {

    const jobData = await JobModel.findOne({ title: title.trim() }).lean();

    if (jobData) {
        throw new CustomError("Job Title already exist", 400)
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
    const removeJob = await JobModel.findByIdAndDelete(id);

    if (!removeJob) {
        throw new CustomError("Job not found", 404);
    }

    return removeJob;
}

export const getMyAppliedJobsService = async (id, limit, offset) => {

    const myAppliedJob = await JobApplicationModel.find({ candidateId: id })
        .sort({ AppliedAt: -1 })
        .skip(offset)
        .limit(limit).lean();

    if (!myAppliedJob.length) {
        return { AllJobs: [], totalCount: 0 };
    }

    const jobIds = myAppliedJob.map(application => application.jobId);

    const totalCount = await JobApplicationModel.countDocuments({
        candidateId: id
    });

    const AllJobs = await JobModel.find({
        _id: { $in: jobIds }
    }).lean();

    return { AllJobs, totalCount }
}

export const getJobsByCandidateService = async (id, limit, offset) => {
    const candidateIds = Array.isArray(id) ? id : id ? [id] : [];

    const isValidIds = candidateIds.some(id => !mongoose.isValidObjectId(id));

    if (candidateIds.length === 0 || isValidIds) {
        throw new CustomError("Candidate ID(s) is required", 400);
    }

    const candidateAppliedJob = await JobApplicationModel.find({ candidateId: { $in: candidateIds } })
        .sort({ createdAt: -1 })
        .populate("candidateId", "username email").lean();

    const JobIds = [...new Set(candidateAppliedJob.filter(application => application.jobId)
        .map(application => application.jobId.toString()))];

    const totalJobs = await JobModel.countDocuments({ _id: { $in: JobIds } });

    if (JobIds.length === 0) {
        return {
            jobs: [],
            totalJobs: 0
        };
    }

    const jobs = await JobModel.find({
        _id: { $in: JobIds }
    }).sort({ createdAt: -1 }).skip(offset).limit(limit).lean();

    return { jobs, totalJobs };
}

export const getJobApplyCandidateForRecruiterService = async (id, limit, offset) => {
    const recruiterJobs = await JobModel.find({ recruiterId: id }).lean();

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
        .limit(limit).lean();

    return { applicants, totalApplications }
}

export const applyJobByCandidateService = async (jobId, candidateId) => {
  
    if (!mongoose.isValidObjectId(jobId)) {
        throw new CustomError("Job Id is required", 400)
    }
    const jobDetails = await JobModel.findById({ _id: jobId }).lean();

    if (!jobDetails) {
        throw new CustomError("Job not found with this jobId", 404);
    }

    const isExistApplication = await JobApplicationModel.findOne({
        candidateId, jobId
    }).lean();

    if (isExistApplication) {
        throw new CustomError("Candidate already applied for this job", 409);
    }

    const candidate = await UserModal.findOne({
        _id: candidateId,
        role: ROLES.CANDIDATE
    }).lean();

    if (!candidate) {
        throw new CustomError("Candidate not found", 404);
    }

    const recruiter = await UserModal.findOne({
        _id: jobDetails.recruiterId,
        role: ROLES.RECRUITER
    }).lean();

    if (!recruiter) {
        throw new CustomError("Recruiter not found", 404);
    }

    const application = await JobApplicationModel.create({
        candidateId,
        jobId
    });

    // Asynchronously dispatch email notification via EventEmitter (non-blocking)
    jobEmitter.emit("job:applied", {
        candidate,
        recruiter,
        jobDetails
    });

    return {
        application
    };
}

