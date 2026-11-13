import express from "express";
import { loginValidator, registerValidator, resetPasswordValidator } from "../validators/adminValidator.js";
import { emailValidator } from "../validators/commonValidator.js";
import { validateRequest } from "../validators/authValidator.js";
import * as authController from "../controllers/publicControllers.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const router = express.Router();

// public routes 

router.post("/register-candidate", registerValidator, validateRequest, ErrorHandler(authController.registerUser));

router.post("/login", loginValidator, validateRequest, ErrorHandler(authController.loginUser));

router.post("/forget-password", emailValidator, validateRequest, ErrorHandler(authController.forgetPassword));

router.post("/reset-password", resetPasswordValidator, validateRequest, ErrorHandler(authController.resetPassword));

export default router;