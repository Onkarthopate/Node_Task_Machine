import User from "../models/UserAuth.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpModal from "../models/otpValidate.js";

export const registerCandidate = ErrorHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All field are requied"
        });
    };

    const isExistEmail = await User.findOne({ email });

    if (isExistEmail) {
        return res.status(409).json({
            success: false,
            message: "Email already exist",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
        username,
        email,
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

export const loginCandidate = ErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        })
    }

    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid email or password",
        })
    }

    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_TIME }
    )

    console.log(token);

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
        return res.status(400).json({
            success: false,
            message: "Email is requied"
        })
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not exist"
        })
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        }
    });

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashOtp = await bcrypt.hash(randomOtp, 10);

    const expireTime = new Date(Date.now() + 10 * 60 * 1000);

    await otpModal.create({
        email: email,
        otp: hashOtp,
        expiresAt: expireTime,
    });

    await transporter.sendMail({
        from: `"Support" <${process.env.EMAIL}>`,
        to: email,
        subject: 'Password Reset OTP',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Your OTP code to reset your password is:</p>
        <h1 style="color: #4CAF50; letter-spacing: 2px;">${randomOtp}</h1>
        <p>This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
      </div>
    `
    });

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email",
    });

})

export const resetPassword = ErrorHandler(async (req, res, next) => {
    const { email, otp, newPass, confirmPass } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and Otp are required",
        });
    }

    if (!newPass || !confirmPass) {
        return res.status(400).json({
            success: false,
            message: "New password and confirm password are required",
        });
    }

    if (newPass !== confirmPass) {
        return res.status(400).json({
            success: true,
            message: "Password do not match",
        });
    }
    const otpData = await otpModal.findOne({ email });
    console.log(otpData);

    if (!otpData) {
        return res.status(400).json({
            success: false,
            message: "OTP not found. Please request a new OTP",
        });
    }


    const MatchOtp = await bcrypt.compare(otp, otpData.otp);

    if (!MatchOtp) {
        return res.status(404).json({
            success: true,
            message: "OTP not found. Please request a new OTP",
        });
    }

    if (otpData.expiresAt <= new Date()) {
        await otpModal.deleteMany({ email });

        return res.status(400).json({
            success: false,
            message: "OTP has expired. Please request a new OTP",
        });
    }

    const isOtpMatch = await bcrypt.compare(otp, otpData.otp);

    if (!isOtpMatch) {
        return res.status(400).json({
            success: false,
            message: "Incorrect OTP. Please try again",
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User does not exist",
        });
    }

    user.password = await bcrypt.hash(newPass, 10);

    await user.save();

    await otpModal.deleteMany({ email });

    return res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
});


