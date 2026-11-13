import express from "express";
import { loginValidator, registerValidator, resetPasswordValidator } from "../validators/adminValidator.js";
import { validateRequest } from "../validators/authValidator.js";
import { emailValidation } from "../utils/Validation.js";
import * as authController from "../controllers/publicControllers.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const router = express.Router();

// public routes 

router.post("/register-candidate", registerValidator, validateRequest, ErrorHandler(authController.registerUser));

router.post("/login", loginValidator, validateRequest, ErrorHandler(authController.loginUser));

router.post("/forget-password", emailValidation, validateRequest, ErrorHandler(authController.forgetPassword));

router.post("/reset-password", resetPasswordValidator, validateRequest, ErrorHandler(authController.resetPassword));

export default router;