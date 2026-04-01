import { Router } from "express";
import { getAnalytics, getUser, getUsers, removeUser, saveUser } from "../controllers/usersController.js";

const router = Router();
router.get("/", getUsers);
router.post("/", saveUser);
router.get("/:id", getUser);
router.put("/:id", saveUser);
router.delete("/:id", removeUser);
router.get("/:id/analytics", getAnalytics);
export default router;
