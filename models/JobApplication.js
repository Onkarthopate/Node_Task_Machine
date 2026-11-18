import mongoose from "mongoose";

const JobApplication = mongoose.Schema({
        candidateId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "UserTable",
            required : [true , "Candidate ID is required"],
        },
        jobId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "JobTable",
            required : [true , "Job ID is required"],
        },
        status : {
            type:String , 
            enum : ["APPLIED", "SHORTLISTED" , "REJECTED"],
            default : "APPLIED",
        },
        appliedAt : {
            type: Date,
            default : Date.now,
        }
    },
    {
        timestamps : true,
    },
);

JobApplication.index({ candidateId: 1, jobId: 1 }, { unique: true });

const JobApplicationModel = mongoose.model("JobApplicationTable",JobApplication);
export default JobApplicationModel;