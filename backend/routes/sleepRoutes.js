import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { saveSleep } from "../controllers/sleep.controller.js";

const router = express.Router();
router.post("/save", saveSleep);

export default router