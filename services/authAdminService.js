import RoleTable from "../models/roleModel.js";
import User from "../models/UserAuth.js";
import CustomError from "../utils/CustomError.js";
import { ROLES, MANAGEABLE_ROLES } from "../constants/roles.js";

// Shared logic for creating a user with a server-decided role.
// The role is NEVER taken from the request body — each endpoint fixes its own role.
const createUserWithRole = async (roleName, username, email, password) => {
    const formatEmail = email.trim().toLowerCase();

    const isExistEmail = await User.findOne({ email: formatEmail }).lean();

    if (isExistEmail) {
    }

    const role = await RoleTable.findOne({ name: roleName }).lean();

    if (!role) {
        throw new CustomError(`${roleName} role not configured`, 500);
    }

    const createUser = await User.create({
        username,
        email: formatEmail,
        password,
        role: role.name
    });

    return {
        id: createUser._id,
        username: createUser.username,
        email: createUser.email,
        role: createUser.role
    };
};

export const registerAdminService = (username, email, password) =>
    createUserWithRole(ROLES.ADMIN, username, email, password);

export const registerRecruiterService = (username, email, password) =>
    createUserWithRole(ROLES.RECRUITER, username, email, password);

export const getAllUsersService = async ({ role, limit, offset }) => {

    if (!MANAGEABLE_ROLES.includes(role)) {
        throw new CustomError("Invalid role", 400);
    }

    const users = await User.find({ role })
        .select("-password")
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit).lean();

    const totalCount = await User.countDocuments({ role });

    return {
        users,
        totalCount
    }
}

export const removeUserService = async (id) => {

    if (!id) {
        throw new CustomError("User Id required", 400);
    }

    const removeUser = await User.findByIdAndDelete(id);

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
    }).lean();

    if (existingEmail) {
        throw new CustomError("Email already exists", 400);
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

    return user;
}