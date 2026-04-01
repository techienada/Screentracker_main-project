import { Router } from "express";
import { createActivity, getActivity } from "../controllers/activityController.js";

const router = Router();
router.get("/", getActivity);
router.post("/", createActivity);
export default router;
