import * as authAdminService from "../services/authAdminService.js";
import { SuccessResponce } from "../utils/responseHandler.js";
import { getPagination } from "../utils/getPagination.js";

// all admin actions

export const registerAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    const user = await authAdminService.registerAdminService(
        username,
        email,
        password
    );

    return SuccessResponce(
        res,
        201,
        "Admin registered successfully",
        user
    );
};

export const registerRecruiter = async (req, res) => {
    const { username, email, password } = req.body;

    const user = await authAdminService.registerRecruiterService(
        username,
        email,
        password
    );

    return SuccessResponce(
        res,
        201,
        "Recruiter registered successfully",
        user
    );
};

export const getAllUsers = async (req, res) => {
    const { role } = req.query;

    const { limit, offset } = getPagination(req.query);

    const { users, totalCount } = await authAdminService.getAllUsersService({
        role, limit, offset
    });

    return SuccessResponce(
        res, 200, `${role} fetched successfully`, users,
        {
            limit, offset, totalCount
        }
    );
};

export const removeUser = async (req, res) => {
    const { id } = req.params;

    const removedUser = await authAdminService.removeUserService(id);

    return SuccessResponce(
        res, 200, "User deleted successfully", removedUser
    );
};

export const updateUser = async (req, res) => {
    const { role } = req.query;
    const { id } = req.params;
    const { username, email } = req.body;

    const user = await authAdminService.updateUserService(
        role, id, username, email
    );

    return SuccessResponce(res, 200, `${role} updated successfully`, user);
};
