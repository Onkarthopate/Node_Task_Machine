import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const genrateJWT = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_TIME }
    )
}

const SALT_ROUNDS = 10;

// Hash password
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// Compare password
export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Generate 6 digit OTP
export const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

// Hash OTP
export const hashOTP = async (otp) => {
    return await bcrypt.hash(otp, 10);
};

// Compare OTP
export const compareOTP = async (plainOTP, hashedOTP) => {
    return await bcrypt.compare(plainOTP, hashedOTP);
};
