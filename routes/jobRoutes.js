import express from "express";
import * as jobControllers from "../controllers/jobControllers.js";
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { AllowedRole } from "../middleware/RoleMiddleware.js";
import { createJobValidator, removeUserValidator } from "../validators/adminValidator.js";
import { validateRequest } from "../validators/authValidator.js";
import { idValidator } from "../validators/commonValidator.js";

const router = express.Router();

router.get("/getAllJobs", AuthTokenMiddleware, AllowedRole("CANDIDATE", "ADMIN"), jobControllers.getAllJobs);

router.get("/getAllJobsByRecruiter", AuthTokenMiddleware, AllowedRole("RECRUITER"), jobControllers.getAllJobsBySpecificRecruiter);

router.delete("/deleteJob/:id", AuthTokenMiddleware, AllowedRole("ADMIN"), removeUserValidator, validateRequest, jobControllers.deleteJobByAdminOnly);

router.post("/createJobs", AuthTokenMiddleware, AllowedRole("RECRUITER"), createJobValidator, validateRequest, jobControllers.postJobsByRecruiter);

// apply job by candidate
router.post("/applyJob", AuthTokenMiddleware, AllowedRole("CANDIDATE"), idValidator , validateRequest, jobControllers.ApplyJobByCandidate)

router.get("/getMyAppliedJob", AuthTokenMiddleware, AllowedRole("CANDIDATE"), jobControllers.getMyAppliedJobs)

// candidate apply job admin want to know 
router.get("/getJobsByCandidate", AuthTokenMiddleware, AllowedRole("ADMIN"), jobControllers.getJobsByCandidate)

// recruiter want to know the candidate have applied job today and prevoisly like filter 

router.get("/getJobApplyCandidateForRecruiter", AuthTokenMiddleware, AllowedRole("RECRUITER"), jobControllers.getJobApplyCandidateForRecruiter)



export default router;
