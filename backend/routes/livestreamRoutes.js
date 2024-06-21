import express from "express";
<<<<<<< HEAD
import {startLive, endLive, checkStream} from "../controllers/livestream.controller.js";
=======
import {startLive} from "../controllers/livestream.controller.js";
>>>>>>> 4881f169b34ebefabd6a9c5b8a0837801725b0f0

const router = express.Router();

router.post("/startLive", startLive);
router.post("/endLive", endLive);
<<<<<<< HEAD
router.post("/checkLive", checkStream)

export default router;
=======

export default router;
>>>>>>> 4881f169b34ebefabd6a9c5b8a0837801725b0f0
