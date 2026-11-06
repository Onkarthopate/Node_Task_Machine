import RoleTable from "../models/roleModel.js";
import CustomError from "../utils/CustomError.js";

export const authorizePermission = (...permissions) => {

    return async (req, res, next) => {

        try {

            const role = await RoleTable.findOne({
                name: req.user.role
            });

            if (!role) {
                throw new CustomError("Role not found");
            }

            const hasPermission = permissions.every(permission =>
                role.permissions.includes(permission)
            );

            if (!hasPermission) {
                throw new CustomError("Permission denied");
            }

            next();

        } catch (error) {
            next(error);
        }
    };
};