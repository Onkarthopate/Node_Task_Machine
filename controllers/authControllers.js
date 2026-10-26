import User from "../models/UserAuth.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpModal from "../models/otpValidate.js";
import { emailValidation, passwordValidation } from "../utils/Validation.js";

export const registerUser = ErrorHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        const error = new Error(
            "username , email , password are required",
        );

        error.statusCode = 400;
        throw error;
    };

    if (!emailValidation(email)) {
        const error = new Error("Please enter a valid email address");
        error.statusCode = 400;
        throw error;
    }

    const formatEmail = email.trim().toLowerCase();

    const isExistEmail = await User.findOne({ email: formatEmail });

    if (isExistEmail) {
        const error = new Error(
            "Email already exist"
        );

        error.statusCode = 409;
        throw error;
    }

    if (!passwordValidation(password)) {
        const error = new Error(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        );

        error.statusCode = 400;
        throw error;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
        username,
        email: formatEmail,
        password: hashPassword,
    });

    console.log(createUser);


    return res.status(201).json({
        success: true,
        message: "user registerd successfully",
        user: {
            id: createUser._id,
            username: createUser.username,
            email: createUser.email,
            role: createUser.role,
        },
    });
});

export const loginUser = ErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error(
            "Email and password are required"
        );

        error.statusCode = 400;
        throw error;
    }

    if (!emailValidation(email)) {
        const error = new Error("Please enter a valid email address");
        error.statusCode = 400;
        throw error;
    }

    const formatEmail = email.trim().toLowerCase();

    if (!passwordValidation(password)) {
        const error = new Error(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        );

        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({ email: formatEmail }).select("+password");
    console.log(user);

    if (!user) {
        const error = new Error(
            "Invalid email or password"
        );

        error.statusCode = 401;
        throw error;
    }

    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) {
        const error = new Error(
            "Invalid email or password"
        );

        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_TIME }
    )


    return res.status(200).json({
        success: true,
        message: "Login Successfull",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    });

})

export const forgetPassword = ErrorHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        const error = new Error(
            "Email is required"
        );

        error.statusCode = 400;
        throw error;
    }

    if (!emailValidation(email)) {
        const error = new Error("Please enter a valid email address");
        error.statusCode = 400;
        throw error;
    }

    const formatEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: formatEmail });
    console.log(user);


    if (!user) {
        const error = new Error(
            "Invalid User"
        );

        error.statusCode = 400;
        throw error;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });

    const randomOtp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const hashOtp = await bcrypt.hash(randomOtp, 10);

    const expireTime = new Date(Date.now() + 10 * 60 * 1000);

    await otpModal.deleteMany({ email });

    await otpModal.create({
        email,
        otp: hashOtp,
        expiresAt: expireTime,
    });

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

        const error = new Error(
            "Unable to send OTP. Please try again."
        );

        error.statusCode = 500;
        throw error;
    }

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email",
    });
});



export const resetPassword = ErrorHandler(async (req, res, next) => {
    const { email, otp, newPass, confirmPass } = req.body;

    if (!email || !otp) {

        const error = new Error(
            "Email and OTP are required"
        );

        error.statusCode = 400;
        throw error;
    }

    if (!emailValidation(email)) {
        const error = new Error("Please enter a valid email address");
        error.statusCode = 400;
        throw error;
    }

    const formatEmail = email.trim().toLowerCase();

    if (!newPass || !confirmPass) {

        const error = new Error(
            "New password and confirm password are required"
        );

        error.statusCode = 400;
        throw error;
    }

    if (!passwordValidation(newPass)) {
        const error = new Error(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        );

        error.statusCode = 400;
        throw error;
    }

    if (newPass !== confirmPass) {
        const error = new Error(
            "New password and confirm password do not match"
        );

        error.statusCode = 401;
        throw error;
    }

    const otpData = await otpModal.findOne({ email: formatEmail });

    if (!otpData) {

        const error = new Error("OTP not found. Please request a new OTP");
        error.statusCode = 400;
        throw error;
    }

    if (otpData.expiresAt <= new Date()) {

        const error = new Error("OTP has expired. Please request a new OTP");
        error.statusCode = 400;
        throw error;
    }

    const isOtpMatch = await bcrypt.compare(
        String(otp),
        otpData.otp
    );

    if (!isOtpMatch) {

        const error = new Error("Incorrect OTP. Please try again");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({ email: formatEmail });

    if (!user) {

        const error = new Error("User does not exist");
        error.statusCode = 404;
        throw error;
    }

    user.password = await bcrypt.hash(newPass, 10);
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
});



