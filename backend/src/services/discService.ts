import { DiscProfile, AudioFeatures } from "../types";

interface DiscAnalysisInput {
  transcript: string;
  audioFeatures?: AudioFeatures;
  conversationHistory?: string[];
}

class DiscService {
  async analyzeProfile(input: DiscAnalysisInput): Promise<DiscProfile> {
    const { transcript, audioFeatures, conversationHistory } = input;

    // Mock DISC analysis - will be replaced with AI implementation
    const assertiveness = this.calculateAssertiveness(
      transcript,
      audioFeatures
    );
    const emotionality = this.calculateEmotionality(transcript, audioFeatures);

    const profile = this.mapToProfile(assertiveness, emotionality);
    const confidence = this.calculateConfidence(transcript, audioFeatures);

    console.log(`🧠 DISC Analysis: ${profile} (${confidence}% confidence)`);

    return {
      assertiveness,
      emotionality,
      profile,
      confidence,
    };
  }

  private calculateAssertiveness(
    transcript: string,
    audioFeatures?: AudioFeatures
  ): number {
    let score = 0;

    // Text-based indicators
    const assertiveWords = [
      "decidir",
      "quero",
      "vou",
      "preciso",
      "agora",
      "rápido",
    ];
    const questionWords = ["como", "quando", "por que", "posso", "poderia"];

    assertiveWords.forEach((word) => {
      if (transcript.toLowerCase().includes(word)) score += 20;
    });

    questionWords.forEach((word) => {
      if (transcript.toLowerCase().includes(word)) score -= 15;
    });

    // Audio-based indicators
    if (audioFeatures) {
      if (audioFeatures.pace > 150) score += 10; // Fast speech = more assertive
      if (audioFeatures.volume > 70) score += 10; // Loud = more assertive
      if (audioFeatures.pauseFrequency < 3) score += 15; // Few pauses = more assertive
    }

    return Math.max(-100, Math.min(100, score));
  }

  private calculateEmotionality(
    transcript: string,
    audioFeatures?: AudioFeatures
  ): number {
    let score = 0;

    // Emotional words
    const emotionalWords = [
      "sentir",
      "incrível",
      "preocupado",
      "animado",
      "equipe",
      "pessoas",
    ];
    const rationalWords = [
      "dados",
      "números",
      "análise",
      "lógico",
      "evidência",
      "prova",
    ];

    emotionalWords.forEach((word) => {
      if (transcript.toLowerCase().includes(word)) score += 20;
    });

    rationalWords.forEach((word) => {
      if (transcript.toLowerCase().includes(word)) score -= 15;
    });

    // Audio-based emotional indicators
    if (audioFeatures) {
      if (audioFeatures.emotionalTone === "positive") score += 25;
      if (audioFeatures.emotionalTone === "negative") score += 15;
      if (audioFeatures.energy > 70) score += 10;
    }

    return Math.max(-100, Math.min(100, score));
  }

  private mapToProfile(
    assertiveness: number,
    emotionality: number
  ): DiscProfile["profile"] {
    if (assertiveness > 0 && emotionality < 0) return "PRAGMATICO";
    if (assertiveness > 0 && emotionality > 0) return "INTUITIVO";
    if (assertiveness < 0 && emotionality < 0) return "ANALITICO";
    if (assertiveness < 0 && emotionality > 0) return "INTEGRADOR";

    // Default for neutral cases
    return "ANALITICO";
  }

  private calculateConfidence(
    transcript: string,
    audioFeatures?: AudioFeatures
  ): number {
    let confidence = 50; // Base confidence

    // More text = higher confidence
    if (transcript.length > 100) confidence += 20;
    if (transcript.length > 200) confidence += 10;

    // Audio features boost confidence
    if (audioFeatures) confidence += 20;

    return Math.min(100, confidence);
  }
}

export const discService = new DiscService();
