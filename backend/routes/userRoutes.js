import express from "express";
import {getUsers} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/onlineUsers",  getUsers);
//we could just get the userID from the client or decode cookie using jwt
export default router;
