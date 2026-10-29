
import { Parser } from "@json2csv/plainjs";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/UserAuth.js"
import mongoose from "mongoose";
import JobApplicationModel from "../models/JobApplication.js";

export const exportUsersByRole = ErrorHandler(async (req, res) => {
  const { role } = req.query;

  if (!["CANDIDATE", "RECRUITER"].includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const userData = await User.find({ role })
    .select("username email role createdAt")
    .lean();

  if (!userData.length) {
    const error = new Error("No users found");
    error.statusCode = 404;
    throw error;
  }

  const parser = new Parser({
    fields: ["username", "email", "role", "createdAt"],
    withBOM: true
  });

  const csv = parser.parse(userData);

  res.attachment(`${role}_users.csv`);
  return res.type("text/csv; charset=utf-8").send(csv);
});

export const exportCandidateAppliedJob = ErrorHandler(async (req, res) => {
  const candidateId = req.query.candidateId;

  const candidateIds = Array.isArray(candidateId) ? candidateId : candidateId ? [candidateId] : [];

  console.log(candidateIds);

  const isValidIds = candidateIds.some(id => !mongoose.isValidObjectId(id));

  // console.log(candidateId);

  if (candidateIds.length === 0 || isValidIds) {
    const error = new Error("Candidate ID(s) is required");
    error.statusCode = 400;
    throw error;
  }

  const candidateAppliedJob = await JobApplicationModel.find({ candidateId: { $in: candidateIds } })
    .populate("candidateId", "username email")
    .populate("jobId", "title description jobRole").sort({ createdAt: -1 });

  console.log("Candidate Applications:", candidateAppliedJob);
  console.log("------------------------------------------");


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

  const csv = parser.parse(userData);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="applied-jobs.csv"'
  );

  return res.status(200).send(csv);
});