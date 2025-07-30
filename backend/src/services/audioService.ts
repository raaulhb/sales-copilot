import { ConversationSession, AudioSegment, AudioFeatures } from "../types";
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
    const { sessionId, audioData, timestamp } = data;

    // Mock audio processing - will be replaced with real implementation
    const mockAudioFeatures: AudioFeatures = {
      pace: Math.floor(Math.random() * 100) + 100, // 100-200 WPM
      volume: Math.floor(Math.random() * 100),
      pitch: Math.floor(Math.random() * 200) + 100, // 100-300 Hz
      energy: Math.floor(Math.random() * 100),
      pauseFrequency: Math.random() * 10,
      emotionalTone: ["positive", "neutral", "negative", "mixed"][
        Math.floor(Math.random() * 4)
      ] as any,
    };

    const segment: AudioSegment = {
      id: uuidv4(),
      sessionId,
      timestamp,
      duration: 3000, // 3 seconds mock
      speakerId: Math.random() > 0.5 ? "seller" : "client",
      transcript: `Mock transcript for audio segment at ${new Date(
        timestamp
      ).toISOString()}`,
      audioFeatures: mockAudioFeatures,
    };

    // Store segment
    const segments = audioSegments.get(sessionId) || [];
    segments.push(segment);
    audioSegments.set(sessionId, segments);

    console.log(`🎙️ Audio segment processed: ${segment.id}`);
    return segment;
  }

  async getAllSessions(userId: string): Promise<ConversationSession[]> {
    return Array.from(sessions.values()).filter(
      (session) => session.userId === userId
    );
  }
}

export const audioService = new AudioService();
