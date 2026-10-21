import mongoose from "mongoose";

const OtpValidate = mongoose.Schema({
    email:{
        type:String,
        require:true,
    },
    otp:{
        type:String,
        require:true,
    },
    expiresAt:{
        type:Date,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:600,
    }
})

const otpModal = mongoose.model("OtpTables",OtpValidate);
export default otpModal;