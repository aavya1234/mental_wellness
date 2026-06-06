// Real API service — connects to Zenith Pathway backend

const BASE_URL = "http://localhost:5000/api";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem("wellness_token");
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
export interface DailyQuote {
  quote: string;
  author: string;
}

export interface Affirmation {
  text: string;
  category: string;
}

export interface MoodEntry {
  date: string;
  mood: number; // 1-10
  emotion: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  emotion: string;
  risk: "low" | "medium" | "high";
  agentResponse: string;
  timestamp: Date;
}

export interface MoodContent {
  affirmations: string[];
  quotes: string[];
  tip: string;
}

export interface ChatSession {
  id: string;
  createdAt: string;
  lastActivity: string;
  messageCount: number;
  firstMessage: string;
}

// ──────────────────────────────────────────────
// Session ID management (stored in sessionStorage)
// ──────────────────────────────────────────────
function getActiveSessionId(): string | null {
  return sessionStorage.getItem("chat_session_id");
}
function setActiveSessionId(id: string) {
  sessionStorage.setItem("chat_session_id", id);
}
function clearActiveSessionId() {
  sessionStorage.removeItem("chat_session_id");
}

// ──────────────────────────────────────────────
// Wells API
// ──────────────────────────────────────────────
export const wellnessApi = {

  // ── Mood ────────────────────────────────────
  async logMood(moodEntry: Omit<MoodEntry, "date">): Promise<MoodEntry> {
    return apiFetch("/mood", {
      method: "POST",
      body: JSON.stringify({ mood: moodEntry.mood, emotion: moodEntry.emotion, note: moodEntry.note }),
    });
  },

  async getMoodHistory(_days = 30): Promise<MoodEntry[]> {
    const raw = await apiFetch("/mood");
    // Map backend _id → date field
    return raw.map((m: any) => ({
      date: m.createdAt || m.date,
      mood: m.mood,
      emotion: m.emotion || "neutral",
      note: m.note,
    }));
  },

  // ── AI Mood Content ─────────────────────────
  async getMoodContent(mood: string, moodLevel: number, note?: string): Promise<MoodContent> {
    return apiFetch("/mood-content/generate", {
      method: "POST",
      body: JSON.stringify({ mood, moodLevel, note }),
    });
  },

  // ── Chat ────────────────────────────────────
  async startNewChatSession(_userId?: string): Promise<void> {
    const data = await apiFetch("/chat/session/new", { method: "POST" });
    setActiveSessionId(data.sessionId);
  },

  async ensureSession(): Promise<string> {
    let sessionId = getActiveSessionId();
    if (!sessionId) {
      const data = await apiFetch("/chat/session/new", { method: "POST" });
      setActiveSessionId(data.sessionId);
      sessionId = data.sessionId;
    }
    return sessionId!;
  },

  async sendChatMessage(message: string, _userId?: string): Promise<ChatMessage> {
    const sessionId = await this.ensureSession();
    const data = await apiFetch("/chat/send", {
      method: "POST",
      body: JSON.stringify({ message, sessionId }),
    });
    return {
      id: data.id,
      userId: data.userId,
      message: data.message,
      agentResponse: data.agentResponse,
      emotion: data.emotion,
      risk: data.risk,
      timestamp: new Date(data.timestamp),
    };
  },

  async getChatHistory(_userId?: string): Promise<ChatMessage[]> {
    const data = await apiFetch("/chat/history");
    return data.map((m: any) => ({
      id: m.id || m._id,
      userId: m.userId,
      message: m.message,
      agentResponse: m.agentResponse,
      emotion: m.emotion,
      risk: m.risk,
      timestamp: new Date(m.timestamp || m.createdAt),
    }));
  },

  async getPreviousSessions(_userId?: string): Promise<ChatSession[]> {
    return apiFetch("/chat/sessions");
  },
};
