import express from "express";
import * as jobControllers from "../controllers/jobControllers.js";
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { createJobValidator, removeUserValidator } from "../validators/adminValidator.js";
import { validateRequest } from "../validators/authValidator.js";
import { idValidator } from "../validators/commonValidator.js";
import { authorizePermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/getAllJobs", AuthTokenMiddleware, authorizePermission("job:read"), jobControllers.getAllJobs);

router.get("/getAllJobsByRecruiter", AuthTokenMiddleware, authorizePermission("my-created-job:read"), jobControllers.getAllJobsBySpecificRecruiter);

router.delete("/deleteJob/:id", AuthTokenMiddleware, authorizePermission("job:delete"), removeUserValidator, validateRequest, jobControllers.deleteJobByAdminOnly);

router.post("/createJobs", AuthTokenMiddleware, authorizePermission("job:create"), createJobValidator, validateRequest, jobControllers.postJobsByRecruiter);

router.post("/applyJob", AuthTokenMiddleware, authorizePermission("application:create"), idValidator, validateRequest, jobControllers.ApplyJobByCandidate)

router.get("/getMyAppliedJob", AuthTokenMiddleware, authorizePermission("application:read_own"), jobControllers.getMyAppliedJobs)

router.get("/getJobsByCandidate", AuthTokenMiddleware, authorizePermission("application:read_apply_by_candidate"), jobControllers.getJobsByCandidate)

router.get("/getJobApplyCandidateForRecruiter", AuthTokenMiddleware, authorizePermission("application:my-created-job"), jobControllers.getJobApplyCandidateForRecruiter)

export default router;
