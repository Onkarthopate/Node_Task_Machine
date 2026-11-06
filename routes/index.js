import express from "express";

import publicrouter from "./publicRoutes.js";
import authrouter from "./authRoutes.js";
import jobrouter from "./jobRoutes.js";
import exportrouter from "./exportRoutes.js";

const router = express.Router();

// Public routes
router.use("/public", publicrouter);

// Authentication routes
router.use("/auth", authrouter);

// Job routes
router.use("/jobs", jobrouter);

// Export routes
router.use("/export", exportrouter);

export default router;