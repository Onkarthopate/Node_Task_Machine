import { getPagination } from "../utils/getPagination.js";
import { SuccessResponce } from "../utils/responseHandler.js";
import * as jobService from "../services/jobService.js";

export const getAllJobs = async (req, res) => {
    const { limit, offset } = getPagination(req.query);

    const { jobs, totalCount } = await jobService.getAllJobsService({
        limit, offset
    });

    return SuccessResponce(
        res, 200, "Job fetched successfully", jobs,
        {
            limit, offset, totalCount
        }
    );
};

export const getAllJobsBySpecificRecruiter = async (req, res) => {
    const id = req.user.id || req.user._id;

    const { limit, offset } = getPagination(req.query);

    const { getJobByRecruiter, totalCount } = await jobService.getAllJobsBySpecificRecruiterService({
        id, limit, offset
    });

    return SuccessResponce(
        res, 200, "Fetched all jobs created by recruiter", getJobByRecruiter,
        {
            limit, offset, totalCount
        }
    );
};

export const postJobsByRecruiter = async (req, res) => {
    const id = req.user.id || req.user._id;

    const { title, description, jobRole } = req.body;

    const jobData = await jobService.postJobsByRecruiterService({
        id, title, description, jobRole
    });

    return SuccessResponce(
        res, 201, "Job created successfully", jobData
    );
};

export const deleteJobByAdminOnly = async (req, res) => {
    const { id } = req.params;

    await jobService.deleteJobByAdminOnlyService(id);

    return SuccessResponce(
        res, 200, "Job Deleted Successfully!"
    );
};

export const ApplyJobByCandidate = async (req, res) => {
    const { id } = req.params;
    const candidateId = req.user.id || req.user._id;

    const { application } = await jobService.applyJobByCandidateService(id, candidateId);

    return SuccessResponce(
        res, 201, "Job Applied successfully",
        {
            application
        }
    );
};

export const getMyAppliedJobs = async (req, res) => {
    const { limit, offset } = getPagination(req.query);

    const id = req.user.id || req.user._id;

    const { AllJobs, totalCount } = await jobService.getMyAppliedJobsService(id, limit, offset);

    return SuccessResponce(
        res, 200, "Applied jobs fetched successfully", AllJobs,
        {
            limit,
            offset,
            totalCount
        }
    );
};

export const getJobsByCandidate = async (req, res) => {
    const { id } = req.query;

    const { limit, offset } = getPagination(req.query);

    const { jobs, totalJobs } = await jobService.getJobsByCandidateService(id, limit, offset);

    return SuccessResponce(
        res, 200, "Jobs fetched successfully", jobs,
        {
            limit, offset, totalCount: totalJobs
        }
    );
};

export const getJobApplyCandidateForRecruiter = async (req, res) => {
    const id = req.user.id;

    const { limit, offset } = getPagination(req.query);

    const { applicants, totalApplications } = await jobService.getJobApplyCandidateForRecruiterService(id, limit, offset);

    return SuccessResponce(
        res, 200, "Applications fetched successfully", applicants,
        {
            limit, offset, totalCount: totalApplications
        }
    );
};
