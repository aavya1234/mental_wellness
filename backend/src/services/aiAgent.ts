import { GoogleGenerativeAI } from "@google/generative-ai";
import nodemailer from "nodemailer";

// ──────────────────────────────────────────────
// Gemini client
// ──────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ──────────────────────────────────────────────
// Nodemailer transporter (Gmail SMTP)
// ──────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // Use an App Password if 2FA is on
  },
});

// ──────────────────────────────────────────────
// Crisis keyword detection
// ──────────────────────────────────────────────
const HIGH_RISK_WORDS = [
  "suicide", "suicidal", "kill myself", "end my life", "want to die",
  "don't want to live", "no reason to live", "hurt myself", "self-harm",
  "selfharm", "overdose", "jump off", "hang myself", "cut myself",
  // Hinglish variants
  "mar jaunga", "mar jaungi", "jeena nahi", "khatam kar lun", "khatam kar loon",
  "zindagi khatam", "marna chahta", "marna chahti",
];

const MEDIUM_RISK_WORDS = [
  "hopeless", "worthless", "nobody cares", "no one cares", "empty inside",
  "don't want to be here", "can't go on", "give up", "no point",
  "depressed", "depression", "alone forever", "no hope",
  // Hinglish
  "nahi rehna", "ummeed nahi", "akela hoon", "akeli hoon", "haar gaya", "haar gayi",
];

export type RiskLevel = "low" | "medium" | "high";

export function detectRisk(message: string): RiskLevel {
  const lower = message.toLowerCase();
  if (HIGH_RISK_WORDS.some((w) => lower.includes(w))) return "high";
  if (MEDIUM_RISK_WORDS.some((w) => lower.includes(w))) return "medium";
  return "low";
}

// ──────────────────────────────────────────────
// Send crisis alert email to counsellor
// ──────────────────────────────────────────────
export async function sendCrisisEmail(
  userEmail: string,
  userName: string,
  userMessage: string
): Promise<void> {
  const counselorEmail = process.env.COUNSELOR_EMAIL;
  if (!counselorEmail) {
    console.warn("COUNSELOR_EMAIL not set — skipping email alert.");
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: counselorEmail,
    subject: "🚨 URGENT: High-Risk Message Detected — Zenith Pathway",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; background: #fff5f5; border-left: 6px solid #e53e3e; border-radius: 8px;">
        <h2 style="color: #c53030;">⚠️ Crisis Alert — Immediate Attention Required</h2>
        <p style="font-size: 16px; color: #333;">A student on <strong>Zenith Pathway</strong> has sent a message that may indicate a mental-health crisis.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:16px;">
          <tr>
            <td style="padding:8px; background:#fff; font-weight:bold; border:1px solid #fed7d7; width:130px;">Name</td>
            <td style="padding:8px; background:#fff; border:1px solid #fed7d7;">${userName}</td>
          </tr>
          <tr>
            <td style="padding:8px; background:#fff8f8; font-weight:bold; border:1px solid #fed7d7;">Email</td>
            <td style="padding:8px; background:#fff8f8; border:1px solid #fed7d7;">${userEmail}</td>
          </tr>
          <tr>
            <td style="padding:8px; background:#fff; font-weight:bold; border:1px solid #fed7d7; vertical-align:top;">Message</td>
            <td style="padding:8px; background:#fff; border:1px solid #fed7d7; color:#c53030; font-style:italic;">"${userMessage}"</td>
          </tr>
          <tr>
            <td style="padding:8px; background:#fff8f8; font-weight:bold; border:1px solid #fed7d7;">Time</td>
            <td style="padding:8px; background:#fff8f8; border:1px solid #fed7d7;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
          </tr>
        </table>

        <p style="margin-top:24px; color:#c53030; font-weight:bold;">Please reach out to this student as soon as possible.</p>
        <p style="color:#718096; font-size:13px;">— Zenith Pathway Wellness System (automated alert)</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`[CRISIS EMAIL] Sent to counsellor for user: ${userEmail}`);
}

// ──────────────────────────────────────────────
// Counsellor Chat Agent
// ──────────────────────────────────────────────
const COUNSELLOR_SYSTEM_PROMPT = `You are Zara, a compassionate AI mental-health counsellor for the Zenith Pathway student wellness platform.

Your personality:
- Warm, empathetic, non-judgmental
- You speak like a real counsellor — you listen first, then gently reflect before offering guidance
- You support both English and Hinglish (Hindi-English mix) seamlessly
- You NEVER give generic, robotic replies; every response feels personal

Your responsibilities:
1. Help students process emotions through active listening
2. Ask open-ended questions to understand the student better
3. Offer evidence-based coping techniques (breathing, grounding, journaling) when appropriate
4. Gently encourage professional help when needed (without being alarmist)
5. If the student sounds like they are in crisis, respond with empathy AND tell them to contact a professional immediately

Important rules:
- Never diagnose
- Never dismiss or minimise feelings
- Keep responses concise — 2-4 sentences max unless the student needs more support
- Always end with a gentle, open follow-up question or affirmation
- Do not repeat the same opener every message`;

export async function counsellorChat(
  conversationHistory: Array<{ role: "user" | "model"; parts: string }>,
  newMessage: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: COUNSELLOR_SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: conversationHistory.map((m) => ({
        role: m.role,
        parts: [{ text: m.parts }],
      })),
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.8,
      },
    });

    const result = await chat.sendMessage(newMessage);
    return result.response.text();
  } catch (err) {
    console.error("[AI Agent] counsellorChat error:", err);
    return "I'm here for you. Could you tell me a little more about what you're going through?";
  }
}

// ──────────────────────────────────────────────
// Mood-Based Content Generator
// ──────────────────────────────────────────────
export interface MoodContent {
  affirmations: string[];
  quotes: string[];
  tip: string;
}

export async function generateMoodContent(
  mood: string,
  moodLevel: number,
  note?: string
): Promise<MoodContent> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate personalised mental-wellness content for a student who is feeling "${mood}" with a mood level of ${moodLevel}/10.
${note ? `Their personal note: "${note}"` : ""}

Return ONLY valid JSON in exactly this structure (no markdown, no code fences):
{
  "affirmations": ["<affirmation 1>", "<affirmation 2>", "<affirmation 3>"],
  "quotes": ["<quote with attribution e.g. — Author>", "<quote 2>", "<quote 3>"],
  "tip": "<one practical, compassionate tip for managing this mood today>"
}

Guidelines:
- Affirmations must be first-person, present-tense, and emotionally resonant
- Quotes should be real, attributable quotes
- Tip must be specific and actionable (not generic)
- Tone: warm, supportive, non-preachy`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if present
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(cleaned) as MoodContent;
  } catch (err) {
    console.error("[AI Agent] generateMoodContent error:", err);
    // Graceful fallback
    return {
      affirmations: [
        "I am doing the best I can right now.",
        "My feelings are valid and they will pass.",
        "I deserve care and compassion.",
      ],
      quotes: [
        "This too shall pass. — Persian proverb",
        "You are braver than you believe. — A.A. Milne",
        "Every day is a second chance.",
      ],
      tip: "Take three slow deep breaths right now — inhale for 4 counts, hold for 4, exhale for 6.",
    };
  }
}

// ──────────────────────────────────────────────
// Emotion detector (from free text)
// ──────────────────────────────────────────────
export async function detectEmotion(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Identify the primary emotion in this message in one word (e.g. happy, sad, anxious, angry, hopeful, tired, frustrated, calm, overwhelmed). Message: "${message}". Reply with ONLY the single emotion word.`
    );
    return result.response.text().trim().toLowerCase().replace(/[^a-z]/g, "");
  } catch {
    return "neutral";
  }
}
