import express from "express";
import * as authAdminController from "../controllers/authAdminController.js"
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../validators/authValidator.js";
import { registerValidator, removeUserValidator, updateUserValidator } from "../validators/adminValidator.js";
import {authorizePermission} from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/getAllUsers", AuthTokenMiddleware, authorizePermission("user:manage"), authAdminController.getAllUsers);

router.delete("/removeUser/:id", AuthTokenMiddleware, authorizePermission("user:manage"), removeUserValidator,
    validateRequest, authAdminController.removeUser);

router.put("/updateUser/:id", AuthTokenMiddleware, authorizePermission("user:manage"), updateUserValidator,
    validateRequest, authAdminController.updateUser);


router.post("/registerRecruiter", AuthTokenMiddleware, authorizePermission("create-recruiter"), registerValidator,
    validateRequest, authAdminController.registerRecruiter);

// for admin only 
router.post("/registerAdmin", registerValidator,
    validateRequest, authAdminController.registerAdmin);

export default router;