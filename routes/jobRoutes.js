import express from "express";
import * as jobControllers from "../controllers/jobControllers.js";
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { AllowedRole } from "../middleware/RoleMiddleware.js";

const router = express.Router();

router.get("/getAllJobs", AuthTokenMiddleware , AllowedRole("CANDIDATE", "RECRUITER","ADMIN") , jobControllers.getAllJobs);

router.delete("/deleteJob/:id", AuthTokenMiddleware , AllowedRole("ADMIN") , jobControllers.deleteJobByAdminOnly);

router.post("/createJobs",AuthTokenMiddleware , AllowedRole("RECRUITER") ,jobControllers.postJobsByRecruiter);

// apply job by candidate
router.post("/applyJob",AuthTokenMiddleware , AllowedRole("CANDIDATE"),jobControllers.ApplyJobByCandidate)

router.get("/getMyAppliedJob",AuthTokenMiddleware , AllowedRole("CANDIDATE"),jobControllers.getMyAppliedJobs)

// candidate apply job admin want to know 
router.get("/getJobsByCandidate",AuthTokenMiddleware , AllowedRole("ADMIN"),jobControllers.getJobsByCandidate)


export default router;
