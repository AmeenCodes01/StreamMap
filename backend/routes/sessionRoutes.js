import express from "express";
import {getSessions, saveSession} from "../controllers/session.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.get("/", getSessions);
//we could just get the userID from the client or decode cookie using jwt
router.post("/save/:id", saveSession);
export default router;
