const { default: mongoose } = require("mongoose");

const JobApplication = mongoose.Schema({
        candidateId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "UserTable",
            required : [true , "Candidate ID is required"],
        },
        JobId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "JobTable",
            required : [true , "Job ID is required"],
        },
        Status : {
            type:String , 
            enum : ["APPLIED", "ShHORTLISTED" , "REJECTED"],
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