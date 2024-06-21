import express from "express";
<<<<<<< HEAD
import {getUsers} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/onlineUsers",  getUsers);
=======
import {getUsers, changeCountry} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/",  getUsers);   ?
router.post("/changeCountry", changeCountry)

>>>>>>> 4881f169b34ebefabd6a9c5b8a0837801725b0f0
//we could just get the userID from the client or decode cookie using jwt
export default router;
