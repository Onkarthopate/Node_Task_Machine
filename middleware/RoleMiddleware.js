import ErrorHandler from "../utils/ErrorHandler.js";

export const AllowedRole = (...role) => {
    return ErrorHandler(async (req, res, next) => {
        if (!req.user) {
            const error = new Error("User info not valid");
            error.statusCode = 404;
            throw error
        };

        if (!role.includes(req.user.role)) {
            const error = new Error("You do not have permission");
            error.statusCode = 404;
            throw error
        }

        next();
    })
}

