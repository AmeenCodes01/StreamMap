import express from "express";
import { saveSleep } from "../controllers/sleep.controller.js";

const router = express.Router();
router.post("/save", saveSleep);

export default router