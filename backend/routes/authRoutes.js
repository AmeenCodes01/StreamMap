import express from "express";
import {login, signup, check} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/check", check);

export default router;
