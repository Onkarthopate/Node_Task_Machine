import ErrorHandler from "../utils/ErrorHandler.js";
import * as authAdminService from "../services/authAdminService.js";
import { SuccessResponce } from "../utils/responseHandler.js";
import { getPagination } from "../utils/getPagination.js";

// all admin actions

export const registerAdmin = ErrorHandler(async (req, res, next) => {
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
});

export const registerRecruiter = ErrorHandler(async (req, res, next) => {
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
});

export const getAllUsers = ErrorHandler(async (req, res) => {
    const { role } = req.query;

    const { limit, offset } = getPagination(req.query);

    const { users, totalCount } = await authAdminService.getAllUsersService({
        role, limit, offset
    })

    return SuccessResponce(
        res, 200, `${role} fetched sucessfully`, users,
        {
            limit, offset, totalCount
        }
    )
});

export const removeUser = ErrorHandler(async (req, res) => {

    const { id } = req.params;

    const removeUser = await authAdminService.removeUserService({
        id
    });

    return SuccessResponce(
        res, 200, "user deleted sucessfully", removeUser,
    )
});

export const updateUser = ErrorHandler(async (req, res) => {
    const { role } = req.query;
    const { id } = req.params;
    const { username, email } = req.body;


    const user = await authAdminService.updateUserService(
        role,id,username,email
    )

    return SuccessResponce(res,200,`${role} updated sucessfully`,user)
});
