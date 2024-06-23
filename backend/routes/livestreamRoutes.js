import express from "express";
import {
  startLive,
  endLive,
  checkStream,
} from "../controllers/livestream.controller.js";

const router = express.Router();

router.post("/startLive", startLive);
router.post("/endLive", endLive);
router.post("/checkLive", checkStream);

export default router;
