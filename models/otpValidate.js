
import mongoose from "mongoose";

const OtpValidate = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600,
    },
});

const otpModal = mongoose.model("OtpTables", OtpValidate);

export default otpModal;
