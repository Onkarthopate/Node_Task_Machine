import express from "express";
import * as jobControllers from "../controllers/jobControllers.js";
import { AuthTokenMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/getAllJobs",jobControllers.getAllJobs);


router.post("/createJobs",AuthTokenMiddleware ,jobControllers.postJobsByRecruiter);


export default router;
