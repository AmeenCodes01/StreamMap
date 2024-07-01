import express from "express";
import {
  deletePromise,
  editPromise,
  getPromises,
  newPromise,
  updatePromise,
} from "../controllers/promises.controller.js";

const router = express.Router();
router.post("/get", getPromises);
router.post("/new", newPromise);
router.post("/edit", editPromise);
router.post("/delete", deletePromise);
router.post("/update", updatePromise);
export default router;