import express from "express";

const router = express.Router();

// Health check endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sales Co-pilot API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

export default router;
