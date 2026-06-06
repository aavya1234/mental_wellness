import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    console.log("Register request:", { email, name });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
    });

    console.log("User created:", user.email);

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("=================================");
    console.log("LOGIN REQUEST");
    console.log("Email:", email);
    console.log("Password received:", password);
    console.log("=================================");

    const user = await User.findOne({ email });

    console.log("User found:", user);

    if (!user) {
      console.log("❌ User not found");

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    console.log("Password match:", match);

    if (!match) {
      console.log("❌ Password mismatch");

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful");

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: (user as any).name || user.email.split("@")[0],
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};