import express from "express";
import * as authController from "../controllers/authControllers.js"
import * as authAdminController from "../controllers/authAdminController.js"
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { AllowedRole } from "../middleware/RoleMiddleware.js";
import * as exportController from "../controllers/exportController.js"

const router = express.Router();

// public routes 
router.post("/registerCandidate", authController.registerUser);

// All for candidate and recruiter and admin
router.post("/login", authController.loginUser);

router.post("/forgetPassword", authController.forgetPassword);

router.post("/resetPassword", authController.resetPassword);

// get all users and update delete by admin role == ...

router.get("/getAllUsers", AuthTokenMiddleware, AllowedRole("ADMIN"), authAdminController.getAllUsers);

router.delete("/removeUser/:id", AuthTokenMiddleware, AllowedRole("ADMIN"), authAdminController.removeUser);

router.put("/updateUser/:id", AuthTokenMiddleware, AllowedRole("ADMIN"), authAdminController.updateUser);


router.post("/registerRecruiter", AuthTokenMiddleware, AllowedRole("ADMIN"), authAdminController.registerRecruiter);

// router.post("/loginRecruiter", authController.loginUser);

// for admin only 
router.post("/registerAdmin", authAdminController.registerAdmin);

// router.post("/loginAdmin",authController.loginUser);


// export candidate recruiter by its role wise 
router.get("/export", AuthTokenMiddleware, AllowedRole("ADMIN"), exportController.exportUsersByRole);


export default router;