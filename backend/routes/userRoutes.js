import express from "express";
import {getUsers, changeCountry} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/",  getUsers);   ?
router.post("/changeCountry", changeCountry)

//we could just get the userID from the client or decode cookie using jwt
export default router;
