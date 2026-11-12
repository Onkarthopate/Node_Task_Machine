import express from "express";
import * as jobControllers from "../controllers/jobControllers.js";
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { createJobValidator, removeUserValidator } from "../validators/adminValidator.js";
import { validateRequest } from "../validators/authValidator.js";
import { paramIdValidator, queryIdValidator } from "../validators/commonValidator.js";
import { authorizePermission } from "../middleware/permissionMiddleware.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const router = express.Router();

router.get("/", AuthTokenMiddleware, authorizePermission("job:read"), ErrorHandler(jobControllers.getAllJobs));

router.get("/recruiter", AuthTokenMiddleware, authorizePermission("my-created-job:read"), ErrorHandler(jobControllers.getAllJobsBySpecificRecruiter));

router.delete("/:id", AuthTokenMiddleware, authorizePermission("job:delete"), removeUserValidator, validateRequest, ErrorHandler(jobControllers.deleteJobByAdminOnly));

router.post("/", AuthTokenMiddleware, authorizePermission("job:create"), createJobValidator, validateRequest, ErrorHandler(jobControllers.postJobsByRecruiter));

router.post("/:id/apply", AuthTokenMiddleware, authorizePermission("application:create"), paramIdValidator, validateRequest, ErrorHandler(jobControllers.ApplyJobByCandidate));

router.get("/applied", AuthTokenMiddleware, authorizePermission("application:read_own"), ErrorHandler(jobControllers.getMyAppliedJobs));

router.get("/candidate", AuthTokenMiddleware, authorizePermission("application:read_apply_by_candidate"), queryIdValidator, validateRequest, ErrorHandler(jobControllers.getJobsByCandidate));

router.get("/recruiter/applications", AuthTokenMiddleware, authorizePermission("application:my-created-job"), ErrorHandler(jobControllers.getJobApplyCandidateForRecruiter));

export default router;
