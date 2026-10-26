import express from "express";
import * as jobControllers from "../controllers/jobControllers.js";
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { AllowedRole } from "../middleware/RoleMiddleware.js";

const router = express.Router();

router.get("/getAllJobs", AuthTokenMiddleware , AllowedRole("CANDIDATE", "RECRUITER") , jobControllers.getAllJobs);

router.delete("/deleteJob/:id", AuthTokenMiddleware , AllowedRole("ADMIN") , jobControllers.deleteJobByAdminOnly);

router.post("/createJobs",AuthTokenMiddleware , AllowedRole("RECRUITER") ,jobControllers.postJobsByRecruiter);

export default router;
