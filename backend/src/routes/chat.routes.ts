import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  sendMessage,
  startNewSession,
  getChatHistory,
  getPreviousSessions,
} from "../controllers/chat.controller";

const router = Router();

// All chat routes are protected
router.post("/send", protect, sendMessage);
router.post("/session/new", protect, startNewSession);
router.get("/history", protect, getChatHistory);
router.get("/sessions", protect, getPreviousSessions);

export default router;
