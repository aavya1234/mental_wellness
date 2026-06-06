import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { createMood, getMoods, deleteMood } from "../controllers/mood.controller";

const router = Router();

router.post("/", protect, createMood);
router.get("/", protect, getMoods);
router.delete("/:id", protect, deleteMood);

export default router;
