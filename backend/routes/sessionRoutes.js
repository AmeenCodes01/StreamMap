import express from "express";
import {
  getSessions,
  saveSession,
  getSessionByID,
  startSession,
  resetSession,
  checkSession,
  rateSession
} from "../controllers/session.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/", protectRoute, getSessions);
//we could just get the userID from the client or decode cookie using jwt
router.post("/start", startSession);
router.post("/save", saveSession);
router.post("/reset", resetSession);
router.post("/user", getSessionByID);
router.post("/check", checkSession)
router.post("/rate", rateSession)
export default router;
