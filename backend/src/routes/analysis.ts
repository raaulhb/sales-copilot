import express from "express";
import { analysisController } from "../controllers/analysisController";
import { discService } from "../services/discService";
const router = express.Router();

// Analysis routes
router.post("/disc", analysisController.analyzeDisc);
router.post("/sentiment", analysisController.analyzeSentiment);
router.get(
  "/session/:sessionId/insights",
  analysisController.getSessionInsights
);
router.post("/recommendations", analysisController.generateRecommendations);

// Test route for DISC profiles
router.get("/test-disc/:profile", async (req, res) => {
  try {
    const { profile } = req.params;

    if (
      !["PRAGMATICO", "INTUITIVO", "ANALITICO", "INTEGRADOR"].includes(profile)
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid profile. Use: PRAGMATICO, INTUITIVO, ANALITICO, or INTEGRADOR",
      });
    }

    const result = await discService.testProfile(profile as any);

    res.json({
      success: true,
      data: result,
      message: "DISC profile test completed",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
