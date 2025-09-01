import express from "express";
import { polishText, convertTone, generateReply } from "../services/aiService.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Protected route: polish text
router.post("/polish", verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  const result = await polishText(text);
  res.json({ result });
});

// Protected route: change tone
router.post("/tone", verifyToken, async (req, res) => {
  const { text, tone } = req.body;
  if (!text || !tone) return res.status(400).json({ message: "Text and tone are required" });

  const result = await convertTone(text, tone);
  res.json({ result });
});

// Protected route: AI-generated reply
router.post("/reply", verifyToken, async (req, res) => {
  const { context } = req.body;
  if (!context) return res.status(400).json({ message: "Context is required" });

  const result = await generateReply(context);
  res.json({ result });
});

export default router;
