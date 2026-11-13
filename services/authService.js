import crypto from "crypto";
import CustomError from "../utils/CustomError.js";
import User from "../models/UserAuth.js";
import otpModal from "../models/otpValidate.js";
import { compareOTP, comparePassword, generateOTP, genrateJWT, hashOTP, hashPassword, } from "../utils/commonUtils.js";
import { getTransporter } from "../utils/sendMail.js";

export const registerUserService = async (username, email, password) => {

    const formatEmail = email.trim().toLowerCase();
    const isExistEmail = await User.findOne({ email: formatEmail }).lean();

    if (isExistEmail) {
        throw new CustomError("Email already exists", 400);
    }

    const pass = await hashPassword(password);

    const createUser = await User.create({
        username,
        email: formatEmail,
        password: pass,
    });

    const userResponse = createUser.toObject();
    delete userResponse.password;

    return userResponse;
}

export const loginService = async (email, password) => {
    const formatEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: formatEmail }).select("+password");

    if (!user) {
        throw new CustomError("User with this email not exist", 404);
    }

    const comparePass = await comparePassword(password, user.password);

    if (!comparePass) {
        throw new CustomError("Invalid email or password", 401);
    }

    const sessionId = crypto.randomUUID();
    user.activeSessionId = sessionId;
    await user.save();


    const token = genrateJWT(user._id, user.role, sessionId);

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.activeSessionId;

    return {
        user: userResponse, token
    }
}

export const forgetPasswordService = async (email) => {
    const formatEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: formatEmail }).lean();

    if (!user) {
        throw new CustomError("Invalid User", 400);
    }

    const randomOtp = generateOTP();

    const hashOtp = await hashOTP(randomOtp);

    const expireTime = new Date(Date.now() + 10 * 60 * 1000);

    await otpModal.deleteMany({ email: formatEmail });

    await otpModal.create({
        email,
        otp: hashOtp,
        expiresAt: expireTime,
    });

    const transporter = getTransporter();

    try {
        await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL}>`,
            to: email,
            subject: "Password Reset OTP",
            html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Password Reset Request</h2>
                        <p>Your OTP to reset your password is:</p>
                        <h1 style="color: #4CAF50; letter-spacing: 2px;">
                            ${randomOtp}
                        </h1>
                        <p>This OTP is valid for 10 minutes.</p>
                        <p>If you did not request this, ignore this email.</p>
                    </div>
                `,
        });
    } catch {
        await otpModal.deleteMany({ email });

        throw new CustomError("Unable to send OTP. Please try again.", 500);
    }
}

export const resetPasswordService = async (
    email,
    otp,
    newPass,
    confirmPass
) => {

    const formatEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: formatEmail
    });

    if (!user) {
        throw new CustomError("Invalid User", 404);
    }

    if (newPass !== confirmPass) {
        throw new CustomError(
            "New password and confirm password do not match",
            400
        );
    }

    const otpData = await otpModal.findOne({
        email: formatEmail
    }).lean();

    if (!otpData) {
        throw new CustomError(
            "OTP not found. Please request a new OTP",
            400
        );
    }

    if (otpData.expiresAt <= new Date()) {
        throw new CustomError(
            "OTP has expired. Please request a new OTP",
            400
        );
    }

    const isOtpMatch = await compareOTP(
        String(otp),
        otpData.otp
    );

    if (!isOtpMatch) {
        throw new CustomError(
            "Incorrect OTP. Please try again",
            400
        );
    }

    const hashedPassword = await hashPassword(newPass);

    user.password = hashedPassword;

    await user.save();

    await otpModal.deleteMany({
        email: formatEmail
    });

    return true;
};
