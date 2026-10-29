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

export const getAllUsers = ErrorHandler(async (req, res) => {

    const { role } = req.query;

    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);

    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0);

    if (!["CANDIDATE", "RECRUITER"].includes(role)) {
        const error = new Error("Invalid role");
        error.statusCode = 400;
        throw error;
    }

    const users = await User.find({ role })
        .select("-password")
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit);

    const totalcount = await User.countDocuments({ role });
    console.log(totalcount);

    return res.status(200).json({
        success: true,
        message: `${role} Fetched successfully`,
        limit: limit,
        offset: offset,
        totalcount: totalcount,
        data: users
    })

});

export const removeUser = ErrorHandler(async (req, res) => {

    const { id } = req.params;
    console.log(id);

    if (!id) {
        const error = new Error("user ID is required");
        error.statusCode = 400;
        throw error;
    }

    const removeUser = await User.findByIdAndDelete(id);
    console.log(removeUser);

    return res.status(200).json({
        success: false,
        message: "user Deleted Successfully!",
    });
});

export const updateUser = ErrorHandler(async (req, res) => {
    const { role } = req.query;

    const { id } = req.params;
    console.log(id);
    const { username, email } = req.body;
    console.log(username);
    console.log(email);


    if (!id) {
        const error = new Error("user ID is required");
        error.statusCode = 400;
        throw error;
    }

    if (!mongoose.isValidObjectId(id)) {
        const error = new Error("user ID Not exist");
        error.statusCode = 400;
        throw error;
    }

    if (!username || !email) {
        const error = new Error("username and email is required");
        error.statusCode = 400;
        throw error;
    }



    console.log("ID:", req.params.id);
    console.log("Role:", req.query.role);

    const existingUser = await User.findById(req.params.id);

    console.log("Existing user:", existingUser);
    console.log("Actual role:", existingUser?.role);

    const user = await User.findOneAndUpdate(
        { _id: id, role },
        { $set: { username, email } },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!user) {
        const error = new Error("User Not exist");
        error.statusCode = 400;
        throw error;
    }

    return res.status(200).json({
        success: false,
        message: `${role} Updated Successfully!`,
        data: user,
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
