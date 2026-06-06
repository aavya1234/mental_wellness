import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    messageCount: { type: Number, default: 0 },
    firstMessage: { type: String, default: "" },
    lastActivity: { type: Date, default: Date.now },
    // Stores conversation history for Gemini (role + parts)
    history: [
      {
        role: { type: String, enum: ["user", "model"] },
        parts: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ChatSession", chatSessionSchema);
