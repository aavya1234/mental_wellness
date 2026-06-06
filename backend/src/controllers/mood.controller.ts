import { Request, Response } from "express";
import Mood from "../models/Mood";

/**
 * @desc    Create a new mood entry
 * @route   POST /api/mood
 * @access  Private
 */
export const createMood = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    const newMood = await Mood.create({
      user: req.userId,
      mood
    });

    res.status(201).json(newMood);
  } catch (error) {
    res.status(500).json({ message: "Failed to create mood" });
  }
};

/**
 * @desc    Get all moods for logged-in user
 * @route   GET /api/mood
 * @access  Private
 */
export const getMoods = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const moods = await Mood.find({ user: req.userId }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch moods" });
  }
};

/**
 * @desc    Delete a mood entry
 * @route   DELETE /api/mood/:id
 * @access  Private
 */
export const deleteMood = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    await mood.deleteOne();
    res.json({ message: "Mood deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete mood" });
  }
};
