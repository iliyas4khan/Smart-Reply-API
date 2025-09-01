import dotenv from "dotenv";
dotenv.config();

import express from "express";
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middleware/auth.js";  // <-- middleware

const app = express();
const PORT = process.env.PORT || 5000;

// middleware (for parsing JSON)
app.use(express.json());

// connect auth routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// protected health-check route
app.get("/api/health", verifyToken, (req, res) => {
  res.json({ status: "OK", message: `SmartReplyAPI is running 🚀 for ${req.user.username}` });
});

// ✅ new POST route for smart reply
app.post("/smart-reply", verifyToken, (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // dummy response (later you can connect Gemini/OpenAI/etc.)
  const smartReply = `🤖 Smart Reply to "${message}"`;

  res.json({ reply: smartReply });
});

// start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
