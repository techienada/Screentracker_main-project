import { Router } from "express";
import { listReports } from "../controllers/reportsController.js";

const router = Router();
router.get("/", listReports);
export default router;
