import express from "express";
import * as authAdminController from "../controllers/authAdminController.js"
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../validators/authValidator.js";
import { registerValidator, removeUserValidator, updateUserValidator } from "../validators/adminValidator.js";
import { authorizePermission } from "../middleware/permissionMiddleware.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const router = express.Router();

router.get("/users", AuthTokenMiddleware, authorizePermission("user:manage"), ErrorHandler(authAdminController.getAllUsers));

router.delete("/users/:id", AuthTokenMiddleware, authorizePermission("user:manage"), removeUserValidator,
    validateRequest, ErrorHandler(authAdminController.removeUser));

router.put("/users/:id", AuthTokenMiddleware, authorizePermission("user:manage"), updateUserValidator,
    validateRequest, ErrorHandler(authAdminController.updateUser));


router.post("/register-recruiter", AuthTokenMiddleware, authorizePermission("create-recruiter"), registerValidator,
    validateRequest, ErrorHandler(authAdminController.registerRecruiter));

// for admin only 
// router.post("/register-admin", registerValidator,
//     validateRequest, ErrorHandler(authAdminController.registerAdmin));

export default router;