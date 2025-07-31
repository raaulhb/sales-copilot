import { Request, Response, NextFunction } from "express";
import { discService } from "../services/discService";
import { aiService } from "../services/aiService";
import { ApiResponse, DiscProfile } from "../types";
import { recommendationsService } from "../services/recommendationsService";

class AnalysisController {
  async analyzeDisc(req: Request, res: Response, next: NextFunction) {
    try {
      const { transcript, audioFeatures, conversationHistory } = req.body;

      if (!transcript) {
        return res.status(400).json({
          success: false,
          error: "Transcript is required for DISC analysis",
        } as ApiResponse);
      }

      const profile = await discService.analyzeProfile({
        transcript,
        audioFeatures,
        conversationHistory,
      });

      res.json({
        success: true,
        data: profile,
        message: "DISC profile analyzed successfully",
      } as ApiResponse<DiscProfile>);
    } catch (error) {
      next(error);
    }
  }

  async analyzeSentiment(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: "Text is required for sentiment analysis",
        } as ApiResponse);
      }

      const sentiment = await aiService.analyzeSentiment(text);

      res.json({
        success: true,
        data: sentiment,
        message: "Sentiment analyzed successfully",
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getSessionInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;

      const insights = await aiService.generateSessionInsights(sessionId);

      res.json({
        success: true,
        data: insights,
        message: "Session insights generated successfully",
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
  async generateRecommendations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        profile,
        transcript,
        conversationContext,
        salesStage,
        clientName,
        productContext,
      } = req.body;

      if (!profile || !transcript) {
        return res.status(400).json({
          success: false,
          error: "Profile and transcript are required for recommendations",
        } as ApiResponse);
      }

      const recommendations =
        await recommendationsService.generateRecommendations({
          profile,
          transcript,
          conversationContext,
          salesStage,
          clientName,
          productContext,
        });

      res.json({
        success: true,
        data: recommendations,
        message: "Recommendations generated successfully",
      } as ApiResponse);
    } catch (error) {
      console.error("❌ Recommendations generation error:", error);
      next(error);
    }
  }
}

export const analysisController = new AnalysisController();
