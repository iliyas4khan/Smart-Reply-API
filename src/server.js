import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middleware/auth.js";  // <-- import middleware

const app = express();
const PORT = process.env.PORT || 5000;

// middleware (for parsing JSON)
app.use(express.json());

// connect auth routes
app.use("/api/auth", authRoutes);

// protected health-check route
app.get("/api/health", verifyToken, (req, res) => {
  res.json({ status: "OK", message: `SmartReplyAPI is running 🚀 for ${req.user.username}` });
});

// start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
