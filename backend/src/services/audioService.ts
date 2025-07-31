import { ConversationSession, AudioSegment, AudioFeatures } from "../types";
import { whisperService } from "./whisperService";
import { discService } from "./discService";
import { recommendationsService } from "./recommendationsService";
import { v4 as uuidv4 } from "uuid";

// Temporary in-memory storage for demo
const sessions: Map<string, ConversationSession> = new Map();
const audioSegments: Map<string, AudioSegment[]> = new Map();

interface CreateSessionData {
  userId: string;
  clientName?: string;
  clientCompany?: string;
}

interface ProcessAudioData {
  sessionId: string;
  audioData: Buffer;
  timestamp: number;
  filename?: string;
}

class AudioService {
  async createSession(data: CreateSessionData): Promise<ConversationSession> {
    const sessionId = uuidv4();

    const session: ConversationSession = {
      id: sessionId,
      userId: data.userId,
      clientName: data.clientName,
      clientCompany: data.clientCompany,
      startTime: new Date(),
      status: "active",
      audioSegments: [],
    };

    sessions.set(sessionId, session);
    audioSegments.set(sessionId, []);

    console.log(`📞 New session created: ${sessionId}`);
    return session;
  }

  async getSession(sessionId: string): Promise<ConversationSession | null> {
    const session = sessions.get(sessionId);
    if (!session) return null;

    // Get latest audio segments
    const segments = audioSegments.get(sessionId) || [];
    session.audioSegments = segments;

    return session;
  }

  async endSession(sessionId: string): Promise<ConversationSession | null> {
    const session = sessions.get(sessionId);
    if (!session) return null;

    session.status = "completed";
    session.endTime = new Date();

    sessions.set(sessionId, session);
    console.log(`📞 Session ended: ${sessionId}`);

    return session;
  }

  async processAudioSegment(data: ProcessAudioData): Promise<AudioSegment> {
    const { sessionId, audioData, timestamp, filename } = data;

    console.log(`🎙️ Processing audio segment: ${audioData.length} bytes`);

    try {
      // 1. Transcribe audio with Whisper (real or mock)
      const transcriptionResult = await whisperService.transcribeAudio(
        audioData,
        filename
      );

      // 2. Generate mock audio features (will be replaced with real analysis later)
      const audioFeatures: AudioFeatures = this.generateMockAudioFeatures();

      // 3. Determine speaker (simple logic - can be improved)
      const speakerId = this.determineSpeaker(transcriptionResult.transcript);

      // 4. Analyze DISC profile if it's client speech
      // 4. Analyze DISC profile if it's client speech
      let currentProfile = undefined;
      let recommendations = undefined;

      if (
        speakerId === "client" &&
        transcriptionResult.transcript.trim().length > 10
      ) {
        try {
          currentProfile = await discService.analyzeProfile({
            transcript: transcriptionResult.transcript,
            audioFeatures,
            speakerId,
          });

          // 5. Generate recommendations based on profile
          if (currentProfile) {
            try {
              recommendations =
                await recommendationsService.generateRecommendations({
                  profile: currentProfile,
                  transcript: transcriptionResult.transcript,
                  conversationContext:
                    await this.getConversationHistory(sessionId),
                  salesStage: "discovery", // Can be made dynamic later
                });
            } catch (error) {
              console.error("❌ Recommendations generation failed:", error);
            }
          }
        } catch (error) {
          console.error("❌ DISC analysis failed:", error);
        }
      }

      // 5. Create audio segment
      const segment: AudioSegment = {
        id: uuidv4(),
        sessionId,
        timestamp,
        duration: transcriptionResult.duration * 1000, // Convert to ms
        speakerId,
        transcript: transcriptionResult.transcript,
        audioFeatures,
      };

      // 6. Store segment
      const segments = audioSegments.get(sessionId) || [];
      segments.push(segment);
      audioSegments.set(sessionId, segments);

      // 7. Update session with current profile if detected
      if (currentProfile) {
        const session = sessions.get(sessionId);
        if (session) {
          session.currentProfile = currentProfile;
          sessions.set(sessionId, session);
        }
      }

      console.log(
        `✅ Audio segment processed with transcript: "${transcriptionResult.transcript}"`
      );
      if (currentProfile) {
        console.log(
          `🧠 DISC Profile detected: ${currentProfile.profile} (${currentProfile.confidence}%)`
        );
      }
      if (recommendations) {
        console.log(`💡 Recommendation: ${recommendations.immediateAction}`);
        console.log(
          `📝 Suggested Script: "${recommendations.suggestedScript}"`
        );
      }

      return segment;
    } catch (error) {
      console.error("❌ Audio processing error:", error);
      throw error;
    }
  }

  private generateMockAudioFeatures(): AudioFeatures {
    return {
      pace: Math.floor(Math.random() * 80) + 120, // 120-200 WPM
      volume: Math.floor(Math.random() * 60) + 40, // 40-100
      pitch: Math.floor(Math.random() * 150) + 100, // 100-250 Hz
      energy: Math.floor(Math.random() * 60) + 40, // 40-100
      pauseFrequency: Math.random() * 8 + 1, // 1-9 pauses
      emotionalTone: ["positive", "neutral", "negative", "mixed"][
        Math.floor(Math.random() * 4)
      ] as any,
    };
  }

  private determineSpeaker(
    transcript: string
  ): "seller" | "client" | "unknown" {
    const lowerTranscript = transcript.toLowerCase();

    // Simple heuristics to determine speaker
    const clientIndicators = [
      "preciso",
      "quero",
      "gostaria",
      "interesse",
      "como funciona",
      "quanto custa",
      "quando",
      "onde",
      "posso",
      "vocês",
    ];

    const sellerIndicators = [
      "oferecemos",
      "nossa empresa",
      "nosso produto",
      "podemos ajudar",
      "temos",
      "disponibilizamos",
      "garantimos",
      "nossa solução",
    ];

    let clientScore = 0;
    let sellerScore = 0;

    clientIndicators.forEach((indicator) => {
      if (lowerTranscript.includes(indicator)) clientScore++;
    });

    sellerIndicators.forEach((indicator) => {
      if (lowerTranscript.includes(indicator)) sellerScore++;
    });

    if (clientScore > sellerScore) return "client";
    if (sellerScore > clientScore) return "seller";

    // Default to client for analysis purposes
    return "client";
  }

  async getAllSessions(userId: string): Promise<ConversationSession[]> {
    return Array.from(sessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  // Method to get conversation history for DISC analysis
  async getConversationHistory(sessionId: string): Promise<string[]> {
    const segments = audioSegments.get(sessionId) || [];
    return segments
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((segment) => segment.transcript)
      .filter((transcript) => transcript.trim().length > 0);
  }
}

export const audioService = new AudioService();
