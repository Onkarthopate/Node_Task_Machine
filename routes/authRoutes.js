import express from "express";
import * as authController from "../controllers/authControllers.js"
import * as authAdminController from "../controllers/authAdminController.js"
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { AllowedRole } from "../middleware/RoleMiddleware.js";
import { validateRequest } from "../validators/authValidator.js";
import { loginValidator, registerValidator, removeUserValidator, resetPasswordValidator, updateUserValidator } from "../validators/adminValidator.js";
import { emailValidation } from "../utils/Validation.js";

const router = express.Router();

// public routes 
router.post("/registerCandidate", registerValidator, validateRequest, authController.registerUser);

// All for candidate and recruiter and admin
router.post("/login", loginValidator, validateRequest, authController.loginUser);

router.post("/forgetPassword", emailValidation, validateRequest, authController.forgetPassword);

router.post("/resetPassword", resetPasswordValidator, validateRequest, authController.resetPassword);

// get all users and update delete by admin role == ...

router.get("/getAllUsers", AuthTokenMiddleware, AllowedRole("ADMIN"), authAdminController.getAllUsers);

router.delete("/removeUser/:id", AuthTokenMiddleware, AllowedRole("ADMIN"), removeUserValidator,
    validateRequest, authAdminController.removeUser);

router.put("/updateUser/:id", AuthTokenMiddleware, AllowedRole("ADMIN"), updateUserValidator,
    validateRequest, authAdminController.updateUser);


router.post("/registerRecruiter", AuthTokenMiddleware, AllowedRole("ADMIN"), registerValidator,
    validateRequest, authAdminController.registerRecruiter);

// router.post("/loginRecruiter", authController.loginUser);

// for admin only 
router.post("/registerAdmin", registerValidator,
    validateRequest, authAdminController.registerAdmin);

// router.post("/loginAdmin",authController.loginUser);

export default router;