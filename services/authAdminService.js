import User from "../models/UserAuth.js";
import CustomError from "../utils/CustomError.js";
import bcrypt from "bcrypt";
// all admin actions

export const getAllUsersService = async ({role, limit, offset}) => {

    if (!["CANDIDATE", "RECRUITER"].includes(role)) {
        throw new CustomError("Invalid role", 400);
    }

    const users = await User.find({ role })
        .select("-password")
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit);

    const totalcount = await User.countDocuments({ role });

    return {
        users,
        totalcount
    }
}

export const registerRecruiterService = async (username, email, password) => {
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
        role: "RECRUITER"
    });

    return {
        id: createUser._id,
        username: createUser.username,
        email: createUser.email,
        role: createUser.role
    };
};

export const registerAdminService = async (username, email, password) => {
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
        role: "ADMIN"
    });

    return {
        id: createUser._id,
        username: createUser.username,
        email: createUser.email,
        role: createUser.role
    };
};

export const removeUserService = async (id) => {

    if (!id) {
        throw new CustomError("User Id required", 400);
    }

    const removeUser = await User.findByIdAndDelete(id);
    console.log(removeUser);

    if (!removeUser) {
        throw new CustomError("User not found", 404);
    }

    return removeUser;

}

export const updateUserService = async (role, id, username, email) => {

    const formatEmail = email.trim().toLowerCase();
    const existingEmail = await User.findOne({
        email: formatEmail,
        _id: { $ne: id }
    });

    if (existingEmail) {
        throw new CustomError("Email already exists", 409);
    }

    const user = await User.findOneAndUpdate(
        { _id: id, role },
        {
            $set: {
                username: username.trim(),
                email: formatEmail
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!user) {
        throw new CustomError("User not found for this role", 404);
    }


}