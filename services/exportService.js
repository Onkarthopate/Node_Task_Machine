import mongoose from "mongoose";
import User from "../models/UserAuth.js";
import CustomError from "../utils/CustomError.js";
import { Parser } from "@json2csv/plainjs";
import JobApplicationModel from "../models/JobApplication.js";

export const exportUserService = async (role, res) => {

    const userData = await User.find({ role })
        .select("username email role createdAt")
        .lean();

    if (!userData.length) {
        throw new CustomError("No User found");
    }

    const parser = new Parser({
        fields: ["username", "email", "role", "createdAt"],
        withBOM: true
    });

    return parser.parse(userData);
}

export const candidateAppliedJobService = async (id) => {
    const candidateIds = Array.isArray(id) ? id : id ? [id] : [];
    const isValidIds = candidateIds.some(id => !mongoose.isValidObjectId(id));

    if (candidateIds.length === 0 || isValidIds) {
        throw new CustomError("Candidate ID(s) is required");
    }

    const candidateAppliedJob = await JobApplicationModel.find({ candidateId: { $in: candidateIds } })
        .populate("candidateId", "username email")
        .populate("jobId", "title description jobRole").sort({ createdAt: -1 });

    const userData = candidateAppliedJob
        .filter(app => app.candidateId && app.jobId)
        .map(app => ({
            candidateName: app.candidateId.username,
            candidateEmail: app.candidateId.email,
            jobTitle: app.jobId.title,
            jobRole: app.jobId.jobRole,
            description: app.jobId.description,
            appliedAt: app.createdAt
        }));

    const parser = new Parser({
        fields: [
            "candidateName",
            "candidateEmail",
            "jobTitle",
            "jobRole",
            "description",
            "appliedAt"
        ],
        withBOM: true
    });

    return parser.parse(userData);

}