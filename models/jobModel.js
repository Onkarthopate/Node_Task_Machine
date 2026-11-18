import mongoose from "mongoose";

const JobData = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    jobRole: {
        type: String,
        required: true,
    },
    recruiterId: {
        type: mongoose.Schema.ObjectId,
        ref: "UserTable",
        required: [true, "Recruiter ID is required"],
    }
}, {
    timestamps: true
}
)

JobData.index({ candidateId: 1, jobId: 1 }, { unique: true });

const JobModel = mongoose.model("JobTable", JobData);
export default JobModel;