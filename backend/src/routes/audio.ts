import express from "express";
import { audioController } from "../controllers/audioController";

const router = express.Router();

// Audio processing routes
router.post("/process", audioController.processAudio);
router.get("/session/:sessionId", audioController.getSession);
router.post("/session/start", audioController.startSession);
router.post("/session/:sessionId/end", audioController.endSession);

export default router;
