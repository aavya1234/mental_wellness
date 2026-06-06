import { Request, Response } from "express";
import { generateMoodContent } from "../services/aiAgent";

type AuthRequest = Request & { userId?: string };

// ──────────────────────────────────────────────
// POST /api/mood-content/generate
// Body: { mood: string, moodLevel: number, note?: string }
// ──────────────────────────────────────────────
export const getMoodContent = async (req: AuthRequest, res: Response) => {
  try {
    const { mood, moodLevel, note } = req.body;

    if (!mood || moodLevel === undefined) {
      return res.status(400).json({ message: "mood and moodLevel are required" });
    }

    const content = await generateMoodContent(mood, moodLevel, note);
    return res.json(content);
  } catch (err) {
    console.error("[MoodContent Controller] error:", err);
    return res.status(500).json({ message: "Failed to generate mood content" });
  }
};
