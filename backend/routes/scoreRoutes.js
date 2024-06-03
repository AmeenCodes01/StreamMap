import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { updateScore, getRanking, getLiveRanking} from "../controllers/score.controller.js";

const router = express.Router();
router.post("/saveScore", updateScore);
router.post("/ranking",  getRanking);
router.post("/liveRanking", getLiveRanking)
export default router;