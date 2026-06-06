import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getMoodContent } from "../controllers/moodContent.controller";

const router = Router();

router.post("/generate", protect, getMoodContent);

export default router;
