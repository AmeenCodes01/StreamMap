import express from "express";
import {startLive} from "../controllers/livestream.controller.js";

const router = express.Router();

router.post("/manageLive", startLive);

export default router;
