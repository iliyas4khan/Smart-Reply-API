import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { addUser, findUser } from "../users.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (findUser(username)) return res.status(400).json({ message: "User already exists" });

  const user = await addUser(username, password);
  res.status(201).json({ message: "User registered", user: { username: user.username } });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.json({ message: "Login successful", token });
});

export default router;
