import express from "express";
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../validators/authValidator.js";
import { queryIdValidator, roleValidator } from "../validators/commonValidator.js";
import * as exportController from "../controllers/exportController.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const router = express.Router();

// export candidate recruiter by its role wise 
router.get("/export", AuthTokenMiddleware, checkPermission, roleValidator, validateRequest, ErrorHandler(exportController.exportUsersByRole));

// export all or specific candidate applied to job
router.get("/applied-jobs", AuthTokenMiddleware, checkPermission, queryIdValidator, validateRequest, ErrorHandler(exportController.exportCandidateAppliedJob));

export default router;