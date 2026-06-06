import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mood: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Mood", moodSchema);
