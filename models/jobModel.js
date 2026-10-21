import mongoose from "mongoose";

const JobData = mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true,
    },
    description: {
        type: String,
        require: true,
    },
    jobRole: {
        type: String,
        require: true,
    }
}, {
    timeStamp: true
}
)

const JobModel = mongoose.model("JobTable", JobData);
export default JobModel;