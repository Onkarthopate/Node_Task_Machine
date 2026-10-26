import express from "express";
import * as authController from "../controllers/authControllers.js"
import * as authAdminController from "../controllers/authAdminController.js"
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { AllowedRole } from "../middleware/RoleMiddleware.js";

const router = express.Router();

router.post("/registerCandidate",authController.registerUser);

router.post("/loginCandidate",authController.loginUser);

router.post("/forgetPassword" , authController.forgetPassword);

router.post("/resetPassword" ,authController.resetPassword);

router.post("/registerRecruiter", AuthTokenMiddleware , AllowedRole("ADMIN") ,authAdminController.registerRecruiter);

router.get("/getAllRecruiter", AuthTokenMiddleware , AllowedRole("ADMIN") ,authAdminController.getAllRecruiter);

router.delete("/removeRecruiter/:id", AuthTokenMiddleware , AllowedRole("ADMIN") ,authAdminController.removeRecuriter);

router.put("/updateRecruiter/:id", AuthTokenMiddleware , AllowedRole("ADMIN") ,authAdminController.updateRecuriter);

router.post("/registerAdmin" ,authAdminController.registerAdmin);

router.post("/loginRecruiter", authController.loginUser);

router.post("/loginAdmin",authController.loginUser);


export default router;