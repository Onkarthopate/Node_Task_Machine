import express from "express";
import * as jobControllers from "../controllers/jobControllers.js";
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { createJobValidator, removeUserValidator } from "../validators/adminValidator.js";
import { validateRequest } from "../validators/authValidator.js";
import { paramIdValidator, queryIdValidator } from "../validators/commonValidator.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const router = express.Router();

router.get("/", AuthTokenMiddleware, checkPermission, ErrorHandler(jobControllers.getAllJobs));

router.get("/recruiter", AuthTokenMiddleware, checkPermission, ErrorHandler(jobControllers.getAllJobsBySpecificRecruiter));

router.delete("/:id", AuthTokenMiddleware, checkPermission, removeUserValidator, validateRequest, ErrorHandler(jobControllers.deleteJobByAdminOnly));

router.post("/", AuthTokenMiddleware, checkPermission, createJobValidator, validateRequest, ErrorHandler(jobControllers.postJobsByRecruiter));

router.post("/:id/apply", AuthTokenMiddleware, checkPermission, paramIdValidator, validateRequest, ErrorHandler(jobControllers.ApplyJobByCandidate));

router.get("/applied", AuthTokenMiddleware, checkPermission, ErrorHandler(jobControllers.getMyAppliedJobs));

router.get("/candidate", AuthTokenMiddleware, checkPermission, queryIdValidator, validateRequest, ErrorHandler(jobControllers.getJobsByCandidate));

router.get("/recruiter/applications", AuthTokenMiddleware, checkPermission, ErrorHandler(jobControllers.getJobApplyCandidateForRecruiter));

export default router;
