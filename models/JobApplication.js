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
        Status : {
            type:String , 
            enum : ["APPLIED", "SHORTLISTED" , "REJECTED"],
            default : "APPLIED",
        },
        AppliedAt : {
            type: Date,
            default : Date.now,
        }
    },
    {
        timestamps : true,
    },
)

const JobApplicationModel = mongoose.model("JobApplicationTable",JobApplication);
export default JobApplicationModel;