import mongoose from "mongoose";
import JobApplicationModel from "../models/JobApplication.js";
import JobModel from "../models/jobModel.js";
import UserModal from "../models/UserAuth.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendMail } from "../utils/sendMail.js";
import { getPagination } from "../utils/getPagination.js";
import { SuccessResponce } from "../utils/responseHandler.js";
import * as jobService from "../services/jobService.js";

export const getAllJobs = ErrorHandler(async (req, res) => {

    const { limit, offset } = getPagination(req.query);

    const { jobs, totalCount } = await jobService.getAllJobsService({
        limit, offset
    });

    return SuccessResponce(
        res, 200, "Job fetched successfully", jobs,
        {
            limit, offset, totalCount
        }
    )
});

export const getAllJobsBySpecificRecruiter = ErrorHandler(async (req, res) => {
    const id = req.user.id || req.user._id;

    const { limit, offset } = getPagination(req.query);

    const { getJobByRecruiter, totalCount } = await jobService.getAllJobsBySpecificRecruiterService({
        id, limit, offset
    })

    return SuccessResponce(
        res, 200, "fetched all jobs created by recruiter(you)", {
        limit, offset, totalCount, getJobByRecruiter
    });
})

export const postJobsByRecruiter = ErrorHandler(async (req, res) => {
    const id = req.user.id || req.user._id;

    const { title, description, jobRole } = req.body;

    const jobData = await jobService.postJobsByRecruiterService({
        id, title, description, jobRole
    })

    return SuccessResponce(
        res, 201, "Job created successfully", jobData
    )
});

export const deleteJobByAdminOnly = ErrorHandler(async (req, res) => {

    const { id } = req.params;

    await jobService.deleteJobByAdminOnlyService(id);

    return SuccessResponce(
        res, 200, "Job Deleted Successfully!"
    )
});


export const ApplyJobByCandidate = ErrorHandler(async (req, res, next) => {

    const { id } = req.body;
    const candidateId = req.user.id || req.user._id;

    const { application, emailStatus } = await jobService.ApplyJobByCandidateService(id, candidateId)

    return SuccessResponce(
        res, 200, "Job Applied successfully",
        {
            application,
            emailStatus
        }
    )
})

export const getMyAppliedJobs = ErrorHandler(async (req, res) => {

    const { limit, offset } = getPagination(req.query);

    const id = req.user.id || req.user._id;

    const { AllJobs, totalCount } = await jobService.getMyAppliedJobsService(id, limit, offset);

    return SuccessResponce(
        res, 200, "Applied job getting successfully",
        {
            limit,
            offset,
            totalCount,
            AllJobs
        }
    )
})

export const getJobsByCandidate = ErrorHandler(async (req, res) => {
    const { id } = req.body;

    const { limit, offset } = getPagination(req.query);

    const { jobs, totalJobs } = await jobService.getJobsByCandidateService(id, limit, offset);

    console.log(jobs);
    console.log(totalJobs);

    return SuccessResponce(
        res, 200, "Job fetched successfully for admin only",

        {
            limit, offset,
            jobs, totalJobs
        }
    )

})

export const getJobApplyCandidateForRecruiter = ErrorHandler(async (req, res) => {
    const id = req.user.id;

    const { limit, offset } = getPagination(req.query);

    const { applicants, totalApplications } = await jobService.getJobApplyCandidateForRecruiterService(id, limit, offset)

    return SuccessResponce(
        res, 200, "Job fetched successfully",
        {
            limit, offset, applicants, totalApplications
        }
    )
});


