import express from "express";
import {addCountry, checkCountry} from "../controllers/countries.controller.js"

const router = express.Router();

router.post("/add", addCountry)
router.post("/check", checkCountry)



export default router