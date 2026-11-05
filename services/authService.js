import CustomError from "../utils/CustomError.js";
import bcrypt from "bcrypt";
import User from "../models/UserAuth.js";
import { genrateJWT } from "../utils/jwtTokenGenrate.js";
import { getTransporter } from "../utils/sendMail.js";

export const registerUserService = async (username, email, password) => {

    const formatEmail = email.trim().toLowerCase();
    const isExistEmail = await User.findOne({ email: formatEmail });

    if (isExistEmail) {
        throw new CustomError("Email already exists", 409);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
        username,
        email: formatEmail,
        password: hashPassword,
    });

    console.log("createUser", createUser);

    const userResponse = createUser.toObject();
    console.log("userResponse", userResponse);

    delete userResponse.password;

    return userResponse;

}

export const loginService = async (email, password) => {
    const formatEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: formatEmail }).select("+password");

    if (!user) {
        throw new CustomError("User with this email not exist", 404);
    }

    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) {
        throw new CustomError("Invalid email or password", 401);
    }

    const token = genrateJWT(user._id, user.role);

    console.log(token);

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
        user: userResponse, token
    }
}

export const forgetPasswordService = async (email) => {
    const formatEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: formatEmail });

    if (!user) {
        throw new CustomError("Invalid User", 400);
    }

    const randomOtp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const hashOtp = await bcrypt.hash(randomOtp, 10);

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
    });

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

    const isOtpMatch = await bcrypt.compare(
        String(otp),
        otpData.otp
    );

    if (!isOtpMatch) {
        throw new CustomError(
            "Incorrect OTP. Please try again",
            400
        );
    }

    const hashPassword = await bcrypt.hash(newPass, 10);

    user.password = hashPassword;

    await user.save();

    await otpModal.deleteMany({
        email: formatEmail
    });

    return true;
};
