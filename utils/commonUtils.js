import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
export const genrateJWT = (id, role,sessionId) => {
    return jwt.sign(
        { id, role ,sessionId},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_TIME }
    )
}

const SALT_ROUNDS = 12;

// Hash password
export const hashPassword = (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

// Compare password
export const comparePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

// Generate 6 digit OTP
export const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

// Hash OTP
export const hashOTP = (otp) => {
    return bcrypt.hash(otp, 10);
};

// Compare OTP
export const compareOTP = (plainOTP, hashedOTP) => {
    return bcrypt.compare(plainOTP, hashedOTP);
};
