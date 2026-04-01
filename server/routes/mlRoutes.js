import { Router } from "express";
import { predictRisk } from "../controllers/mlController.js";

const router = Router();
router.post("/predict-risk", predictRisk);
export default router;
