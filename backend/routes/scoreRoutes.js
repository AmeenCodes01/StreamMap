import express from "express";
import {
  updateScore,
  getRanking,
  getLiveRanking,
  // getTotalScore,
} from "../controllers/score.controller.js";

const router = express.Router();
router.post("/saveScore", updateScore);
router.post("/ranking", getRanking);
router.post("/liveRanking", getLiveRanking);
// router.post("/getScore", getTotalScore);

export default router;
