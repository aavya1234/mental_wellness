import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import moodRoutes from "./routes/mood.routes";
import chatRoutes from "./routes/chat.routes";
import moodContentRoutes from "./routes/moodContent.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/mood-content", moodContentRoutes);

app.get("/api/health", (_, res) => {
  res.json({ status: "Backend running 🚀 — AI agents active ✅" });
});

export default app;
