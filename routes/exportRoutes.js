import express from "express";
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { AllowedRole } from "../middleware/RoleMiddleware.js";
import { validateRequest } from "../validators/authValidator.js";
import { idValidator, roleValidator } from "../validators/commonValidator.js";
import * as exportController from "../controllers/exportController.js";

const router = express.Router();

// export candidate recruiter by its role wise 
router.get("/export", AuthTokenMiddleware, AllowedRole("ADMIN"), roleValidator, validateRequest, exportController.exportUsersByRole);

// export all or specific candidate applied to job
router.post("/exportCandidateAppliedJob", AuthTokenMiddleware, AllowedRole("ADMIN"), idValidator, validateRequest, exportController.exportCandidateAppliedJob);

export default router;