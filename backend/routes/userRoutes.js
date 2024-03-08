import express from "express";
import {getUsers} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUsers);
//we could just get the userID from the client or decode cookie using jwt
// router.post("/save/:id", protectRoute, saveSession);
export default router;
