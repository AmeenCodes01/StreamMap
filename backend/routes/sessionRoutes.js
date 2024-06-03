import express from "express";
import {getSessions, saveSession,getSessionByID, startSession} from "../controllers/session.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/", protectRoute, getSessions);
//we could just get the userID from the client or decode cookie using jwt
router.post("/start", startSession)
router.post("/save",saveSession);
router.get("/id", getSessionByID);
export default router;
