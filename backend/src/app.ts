import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import healthRoutes from "./routes/health";
import audioRoutes from "./routes/audio";
import analysisRoutes from "./routes/analysis";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("combined"));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/analysis", analysisRoutes);

// Error handling
app.use(errorHandler);

export default app;
