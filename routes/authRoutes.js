import express from "express";
import * as authController from "../controllers/authControllers.js"
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/registerCandidate",authController.registerCandidate);

router.post("/loginCandidate",authController.loginCandidate);

router.post("/forgetPassword" , authController.forgetPassword);

router.post("/resetPassword" ,authController.resetPassword);

export default router;