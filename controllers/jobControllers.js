import JobModel from "../models/jobModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getAllJobs = ErrorHandler(async (req, res, next) => {
    const jobs = await JobModel.find();

    return res.status(200).json({
        success: true,
        totalJobs: jobs.length,
        jobs,
    });
});


export const postJobsByRecruiter = ErrorHandler(async (req, res, next) => {
    const { title, description, jobRole } = req.body;

    if (!title || !description || !jobRole) {

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
    })

    return res.status(201).json({
        success: true,
        message: "Job Created Successfully",
        JobData: JobDeatils,
    })
});
