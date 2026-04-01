import { Router } from "express";
import { predictTrend } from "../controllers/dlController.js";

const router = Router();
router.post("/predict-trend", predictTrend);
export default router;
