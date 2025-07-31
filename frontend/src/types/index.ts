export interface DiscProfile {
  assertiveness: number;
  emotionality: number;
  profile: "PRAGMATICO" | "INTUITIVO" | "ANALITICO" | "INTEGRADOR";
  confidence: number;
}

export interface SalesRecommendation {
  immediateAction: string;
  approach: string;
  suggestedScript: string;
  timing: "immediate" | "short_term" | "long_term";
  rationale: string;
  priority: "high" | "medium" | "low";
  objectionHandling?: string;
  nextSteps: string[];
}

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  timestamp: number;
  duration: number;
}
