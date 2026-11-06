import express from "express";
import { loginValidator, registerValidator, resetPasswordValidator } from "../validators/adminValidator.js";
import { validateRequest } from "../validators/authValidator.js";
import { emailValidation } from "../utils/Validation.js";
import * as authController from "../controllers/publicControllers.js";

const router = express.Router();

// public routes 

router.post("/registerCandidate", registerValidator, validateRequest, authController.registerUser);

router.post("/login", loginValidator, validateRequest, authController.loginUser);

router.post("/forgetPassword", emailValidation, validateRequest, authController.forgetPassword);

router.post("/resetPassword", resetPasswordValidator, validateRequest, authController.resetPassword);

export default router;