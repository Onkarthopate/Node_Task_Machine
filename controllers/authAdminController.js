import mongoose from "mongoose";
import User from "../models/UserAuth.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { emailValidation, passwordValidation } from "../utils/Validation.js";
import bcrypt from "bcrypt";

export const registerRecruiter = ErrorHandler(async (req, res, next) => {
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
        role: "RECRUITER"
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

export const getAllRecruiter = ErrorHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);

    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0);

    const recruiter = await User.find({ role: "RECRUITER" })
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit);

    const totalcount = await User.countDocuments({ role: "RECRUITER" });
    console.log(totalcount);

    return res.status(200).json({
        success: true,
        message: "Recruiter Fetched successfully",
        limit: limit,
        offset: offset,
        totalcount: totalcount,
        data: recruiter
    })

});

export const removeRecuriter = ErrorHandler(async (req, res) => {

    const { id } = req.params;
    console.log(id);

    if (!id) {
        const error = new Error("recruiter ID is required");
        error.statusCode = 400;
        throw error;
    }

    const removeRecruiter = await User.findByIdAndDelete(id);
    console.log(removeRecruiter);

    return res.status(200).json({
        success: false,
        message: "Recruiter Deleted Successfully!",
    });
});

export const updateRecuriter = ErrorHandler(async (req, res) => {

    const { id } = req.params;
    console.log(id);
    const { username, email } = req.body;

    if (!id) {
        const error = new Error("recruiter ID is required");
        error.statusCode = 400;
        throw error;
    }

    if (!mongoose.isValidObjectId(id)) {
        const error = new Error("recruiter ID Not exist");
        error.statusCode = 400;
        throw error;
    }

    if (!username || !email) {
        const error = new Error("username and email is required");
        error.statusCode = 400;
        throw error;
    }

    const recruiter = await User.findOneAndUpdate(
        { _id: id, role: "RECRUITER" },
        { $set: { username, email } },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!recruiter) {
        const error = new Error("Recruiter Not exist");
        error.statusCode = 400;
        throw error;
    }

    return res.status(200).json({
        success: false,
        message: "Recruiter Updated Successfully!",
        user: recruiter,
    });
});

export const registerAdmin = ErrorHandler(async (req, res, next) => {
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
        role: "ADMIN"
    });

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
