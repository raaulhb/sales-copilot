import { DiscProfile } from "../types";

interface SentimentResult {
  sentiment: "positive" | "neutral" | "negative";
  confidence: number;
  emotions: string[];
}

interface RecommendationInput {
  profile: DiscProfile;
  conversationContext: string;
  salesStage: "discovery" | "presentation" | "objection" | "closing";
}

interface Recommendation {
  immediateAction: string;
  approach: string;
  suggestedScript: string;
  timing: string;
  rationale: string;
}

class AiService {
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    // Mock sentiment analysis - will be replaced with OpenAI/other AI service
    const positiveWords = [
      "bom",
      "ótimo",
      "excelente",
      "perfeito",
      "gosto",
      "interessante",
    ];
    const negativeWords = [
      "ruim",
      "caro",
      "difícil",
      "problema",
      "preocupado",
      "não",
    ];

    let score = 0;
    const emotions: string[] = [];

    positiveWords.forEach((word) => {
      if (text.toLowerCase().includes(word)) {
        score += 1;
        emotions.push("positive");
      }
    });

    negativeWords.forEach((word) => {
      if (text.toLowerCase().includes(word)) {
        score -= 1;
        emotions.push("concern");
      }
    });

    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (score > 0) sentiment = "positive";
    if (score < 0) sentiment = "negative";

    const confidence = Math.min(90, Math.abs(score) * 20 + 50);

    console.log(`💭 Sentiment: ${sentiment} (${confidence}% confidence)`);

    return {
      sentiment,
      confidence,
      emotions: [...new Set(emotions)], // Remove duplicates
    };
  }

  async generateRecommendations(
    input: RecommendationInput
  ): Promise<Recommendation> {
    const { profile, conversationContext, salesStage } = input;

    // Generate recommendations based on DISC profile
    const recommendation = this.getProfileBasedRecommendation(
      profile.profile,
      salesStage
    );

    console.log(
      `💡 Generated recommendation for ${profile.profile} in ${salesStage} stage`
    );

    return recommendation;
  }

  async generateSessionInsights(sessionId: string): Promise<any> {
    // Mock session insights - will be replaced with real analysis
    return {
      sessionId,
      duration: "12 minutes",
      profileDetected: "ANALITICO",
      keyInsights: [
        "Cliente demonstrou interesse em dados e evidências",
        "Mencionou necessidade de aprovação da equipe",
        "Preocupação com implementação e timing",
      ],
      recommendedNextSteps: [
        "Enviar case study detalhado",
        "Agendar demo técnica",
        "Preparar cronograma de implementação",
      ],
    };
  }

  private getProfileBasedRecommendation(
    profile: DiscProfile["profile"],
    stage: string
  ): Recommendation {
    const recommendations = {
      PRAGMATICO: {
        immediateAction: "Seja direto e objetivo",
        approach: "Foque em resultados e ROI",
        suggestedScript:
          "Com base nos números que apresentei, vamos definir os próximos passos para implementação?",
        timing: "Imediato - cliente pragmático aprecia eficiência",
        rationale:
          "Perfil pragmático valoriza decisões rápidas e resultados tangíveis",
      },
      INTUITIVO: {
        immediateAction: "Demonstre entusiasmo e visão",
        approach: "Foque em inovação e possibilidades futuras",
        suggestedScript:
          "Imagine como essa solução pode transformar completamente sua operação e colocá-los à frente da concorrência.",
        timing: "Aproveite o momento de empolgação",
        rationale: "Perfil intuitivo se conecta com visão de futuro e inovação",
      },
      ANALITICO: {
        immediateAction: "Forneça dados detalhados",
        approach: "Apresente evidências e casos de estudo",
        suggestedScript:
          "Tenho aqui um case study detalhado de cliente similar que obteve ROI de 280% em 12 meses. Posso compartilhar os dados?",
        timing: "Permita tempo para análise - não pressione",
        rationale:
          "Perfil analítico precisa de dados concretos e tempo para avaliar",
      },
      INTEGRADOR: {
        immediateAction: "Enfatize benefícios para equipe",
        approach: "Foque no impacto nas pessoas e harmonia",
        suggestedScript:
          "Esta solução vai facilitar muito o trabalho da sua equipe e melhorar a colaboração entre os departamentos.",
        timing: "Construa consenso gradualmente",
        rationale:
          "Perfil integrador valoriza impacto positivo nas pessoas e relacionamentos",
      },
    };

    return recommendations[profile] || recommendations.ANALITICO;
  }
}

export const aiService = new AiService();
