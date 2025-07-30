import { Request, Response, NextFunction } from "express";
import { audioService } from "../services/audioService";
import { ApiResponse, ConversationSession } from "../types";
import multer from "multer";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

class AudioController {
  // Middleware for file upload
  uploadMiddleware = upload.single("audio");

  async processAudio(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("📝 Processing audio request...");
      console.log("Body:", req.body);
      console.log("File:", req.file ? `${req.file.size} bytes` : "No file");

      const { sessionId } = req.body;
      const audioFile = req.file;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: "Session ID is required",
        } as ApiResponse);
      }

      if (!audioFile) {
        return res.status(400).json({
          success: false,
          error: "Audio file is required",
        } as ApiResponse);
      }

      const result = await audioService.processAudioSegment({
        sessionId,
        audioData: audioFile.buffer, // Use buffer from multer
        timestamp: Date.now(),
        filename: audioFile.originalname || "audio.wav",
      });

      console.log("✅ Audio processed successfully");

      res.json({
        success: true,
        data: result,
        message: "Audio processed successfully",
      } as ApiResponse);
    } catch (error) {
      console.error("❌ Audio processing error:", error);
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

      console.log(`📞 Session started: ${session.id}`);

      res.status(201).json({
        success: true,
        data: session,
        message: "Session started successfully",
      } as ApiResponse<ConversationSession>);
    } catch (error) {
      console.error("❌ Session start error:", error);
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
