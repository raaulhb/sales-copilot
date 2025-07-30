import express from "express";
import { analysisController } from "../controllers/analysisController";

const router = express.Router();

// Analysis routes
router.post("/disc", analysisController.analyzeDisc);
router.post("/sentiment", analysisController.analyzeSentiment);
router.get(
  "/session/:sessionId/insights",
  analysisController.getSessionInsights
);
router.post("/recommendations", analysisController.generateRecommendations);

export default router;
