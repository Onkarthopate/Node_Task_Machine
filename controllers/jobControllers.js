import JobModel from "../models/jobModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

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
})


