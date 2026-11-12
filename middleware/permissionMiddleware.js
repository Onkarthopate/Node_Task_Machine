import RoleTable from "../models/roleModel.js";
import CustomError from "../utils/CustomError.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const authorizePermission = (...permissions) => {
    return ErrorHandler(async (req, res, next) => {
        if (!req.user || !req.user.role) {
            throw new CustomError("Unauthorized", 401);
        }

        const role = await RoleTable.findOne({
            name: req.user.role.toUpperCase()
        }).lean();

        if (!role) {
            throw new CustomError("Role not found", 403);
        }

        const hasPermission = permissions.every(permission =>
            role.permissions.includes(permission)
        );

        if (!hasPermission) {
            throw new CustomError("Permission denied", 403);
        }

        next();
    });
};