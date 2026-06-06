import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    message: { type: String, required: true },
    agentResponse: { type: String, default: "" },
    emotion: { type: String, default: "neutral" },
    risk: { type: String, enum: ["low", "medium", "high"], default: "low" },
    crisisAlertSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
