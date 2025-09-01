import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// middleware (for parsing JSON)
app.use(express.json());

// health-check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SmartReplyAPI is running 🚀" });
});

// start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
