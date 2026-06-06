import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import ChatMessage from "../models/ChatMessage";
import ChatSession from "../models/ChatSession";
import User from "../models/User";
import {
  counsellorChat,
  detectEmotion,
  detectRisk,
  sendCrisisEmail,
} from "../services/aiAgent";

type AuthRequest = Request & { userId?: string };

// ──────────────────────────────────────────────
// POST /api/chat/send
// ──────────────────────────────────────────────
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { message, sessionId } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Fetch or create a session
    let session = await ChatSession.findOne({
      userId: req.userId,
      sessionId,
      isActive: true,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found. Start a new session first." });
    }

    // Detect risk BEFORE calling AI (so we can inject a crisis note)
    const risk = detectRisk(message);

    // Detect emotion (fire-and-forget timing is handled inside)
    const emotion = await detectEmotion(message);

    // Build the AI response
    // Pass existing conversation history from the session
    const agentResponse = await counsellorChat(session.history as any, message);

    // Persist the exchange into session history
    session.history.push({ role: "user", parts: message });
    session.history.push({ role: "model", parts: agentResponse });
    session.messageCount += 1;
    session.lastActivity = new Date();
    if (!session.firstMessage) session.firstMessage = message.slice(0, 100);
    await session.save();

    // Save chat message record
    const chatMsg = await ChatMessage.create({
      userId: req.userId,
      sessionId: session.sessionId,
      message,
      agentResponse,
      emotion,
      risk,
      crisisAlertSent: false,
    });

    // Crisis alert email
    if (risk === "high" && !chatMsg.crisisAlertSent) {
      const user = await User.findById(req.userId);
      if (user) {
        try {
          await sendCrisisEmail(
            user.email,
            (user as any).name || user.email,
            message
          );
          chatMsg.crisisAlertSent = true;
          await chatMsg.save();
        } catch (emailErr) {
          console.error("[Chat Controller] Failed to send crisis email:", emailErr);
        }
      }
    }

    return res.json({
      id: chatMsg._id,
      userId: req.userId,
      sessionId: session.sessionId,
      message,
      agentResponse,
      emotion,
      risk,
      timestamp: chatMsg.createdAt,
    });
  } catch (err) {
    console.error("[Chat Controller] sendMessage error:", err);
    return res.status(500).json({ message: "Failed to process message" });
  }
};

// ──────────────────────────────────────────────
// POST /api/chat/session/new
// ──────────────────────────────────────────────
export const startNewSession = async (req: AuthRequest, res: Response) => {
  try {
    // Mark any existing active sessions as inactive
    await ChatSession.updateMany(
      { userId: req.userId, isActive: true },
      { isActive: false }
    );

    const sessionId = uuidv4();
    const session = await ChatSession.create({
      userId: req.userId,
      sessionId,
      history: [],
    });

    return res.json({ sessionId: session.sessionId });
  } catch (err) {
    console.error("[Chat Controller] startNewSession error:", err);
    return res.status(500).json({ message: "Failed to start session" });
  }
};

// ──────────────────────────────────────────────
// GET /api/chat/history
// ──────────────────────────────────────────────
export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    // Get active session
    const session = await ChatSession.findOne({ userId: req.userId, isActive: true });
    if (!session) return res.json([]);

    const messages = await ChatMessage.find({
      userId: req.userId,
      sessionId: session.sessionId,
    }).sort({ createdAt: 1 });

    return res.json(messages.map((m) => ({
      id: m._id,
      userId: m.userId,
      message: m.message,
      agentResponse: m.agentResponse,
      emotion: m.emotion,
      risk: m.risk,
      timestamp: m.createdAt,
    })));
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch chat history" });
  }
};

// ──────────────────────────────────────────────
// GET /api/chat/sessions
// ──────────────────────────────────────────────
export const getPreviousSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await ChatSession.find({
      userId: req.userId,
      isActive: false,
    }).sort({ createdAt: -1 }).limit(20);

    return res.json(
      sessions.map((s) => ({
        id: s.sessionId,
        createdAt: s.createdAt,
        lastActivity: s.lastActivity,
        messageCount: s.messageCount,
        firstMessage: s.firstMessage,
      }))
    );
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch sessions" });
  }
};
