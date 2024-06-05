import express from "express";
import {startLive} from "../controllers/livestream.controller.js";

const router = express.Router();

router.post("/startLive", startLive);
router.post("/endLive", endLive);

export default router;
