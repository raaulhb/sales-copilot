export interface AudioSegment {
  id: string;
  sessionId: string;
  timestamp: number;
  duration: number;
  speakerId: "seller" | "client" | "unknown";
  transcript: string;
  audioFeatures: AudioFeatures;
}

export interface AudioFeatures {
  pace: number; // words per minute
  volume: number; // 0-100
  pitch: number; // Hz
  energy: number; // 0-100
  pauseFrequency: number;
  emotionalTone: "positive" | "neutral" | "negative" | "mixed";
}

export interface DiscProfile {
  assertiveness: number; // -100 to +100
  emotionality: number; // -100 to +100
  profile: "PRAGMATICO" | "INTUITIVO" | "ANALITICO" | "INTEGRADOR";
  confidence: number; // 0-100
}

export interface ConversationSession {
  id: string;
  userId: string;
  clientName?: string;
  clientCompany?: string;
  startTime: Date;
  endTime?: Date;
  status: "active" | "completed" | "paused";
  audioSegments: AudioSegment[];
  currentProfile?: DiscProfile;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// DISC Analysis Types
export interface DiscAnalysisResult {
  profile: DiscProfile;
  indicators: string[];
  reasoning: string;
  recommendations?: string[];
}

export interface SalesRecommendation {
  immediateAction: string;
  approach: string;
  suggestedScript: string;
  timing: "immediate" | "short_term" | "long_term";
  rationale: string;
  priority: "high" | "medium" | "low";
}
