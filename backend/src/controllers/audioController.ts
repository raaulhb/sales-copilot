import { Request, Response, NextFunction } from "express";
import { audioService } from "../services/audioService";
import { ApiResponse, ConversationSession } from "../types";

class AudioController {
  async processAudio(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId, audioData, timestamp } = req.body;

      if (!sessionId || !audioData) {
        return res.status(400).json({
          success: false,
          error: "Session ID and audio data are required",
        } as ApiResponse);
      }

      const result = await audioService.processAudioSegment({
        sessionId,
        audioData,
        timestamp: timestamp || Date.now(),
      });

      res.json({
        success: true,
        data: result,
        message: "Audio processed successfully",
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientName, clientCompany, userId } = req.body;

      const session = await audioService.createSession({
        userId: userId || "demo-user",
        clientName,
        clientCompany,
      });

      res.status(201).json({
        success: true,
        data: session,
        message: "Session started successfully",
      } as ApiResponse<ConversationSession>);
    } catch (error) {
      next(error);
    }
  }

  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;

      const session = await audioService.getSession(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          error: "Session not found",
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: session,
      } as ApiResponse<ConversationSession>);
    } catch (error) {
      next(error);
    }
  }

  async endSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;

      const session = await audioService.endSession(sessionId);

      res.json({
        success: true,
        data: session,
        message: "Session ended successfully",
      } as ApiResponse<ConversationSession>);
    } catch (error) {
      next(error);
    }
  }
}

export const audioController = new AudioController();
