import express from "express";
import * as authAdminController from "../controllers/authAdminController.js"
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../validators/authValidator.js";
import { registerValidator, removeUserValidator, updateUserValidator } from "../validators/adminValidator.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const router = express.Router();

router.get("/users", AuthTokenMiddleware, checkPermission, ErrorHandler(authAdminController.getAllUsers));

router.delete("/users/:id", AuthTokenMiddleware, checkPermission, removeUserValidator,
    validateRequest, ErrorHandler(authAdminController.removeUser));

router.put("/users/:id", AuthTokenMiddleware, checkPermission, updateUserValidator,
    validateRequest, ErrorHandler(authAdminController.updateUser));


router.post("/register-recruiter", AuthTokenMiddleware, checkPermission , registerValidator,
    validateRequest, ErrorHandler(authAdminController.registerRecruiter));

// for admin only 
// router.post("/register-admin", registerValidator,
//     validateRequest, ErrorHandler(authAdminController.registerAdmin));

export default router;