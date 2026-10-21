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
        return res.status(400).json({
            success: false,
            message: "All field are requied"
        })
    }

    const jobData = await JobModel.findOne({ title :title.trim()});

    if (jobData) {
        return res.status(409).json({
            success: false,
            message: "Title of same name already exist",
        })
    }

    const JobDeatils = await JobModel.create({
        title : title.trim(),
        description,
        jobRole,
    })

    return res.status(201).json({
        success: true,
        message: "Job Created Successfully",
        JobData: JobDeatils,
    })
});
