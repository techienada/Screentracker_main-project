import { Router } from "express";
import { getDashboard, resetAppData } from "../controllers/dashboardController.js";

const router = Router();
router.get("/", getDashboard);
router.post("/reset", resetAppData);
export default router;
