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
    timeStamp: true
}
)

const JobModel = mongoose.model("JobTable", JobData);
export default JobModel;