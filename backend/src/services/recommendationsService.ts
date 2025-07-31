import { DiscProfile } from "../types";
import { openai, AI_CONFIG } from "../config/ai";

interface RecommendationInput {
  profile: DiscProfile;
  transcript: string;
  conversationContext?: string[];
  salesStage?: "discovery" | "presentation" | "objection" | "closing";
  clientName?: string;
  productContext?: string;
}

interface SalesRecommendation {
  immediateAction: string;
  approach: string;
  suggestedScript: string;
  timing: "immediate" | "short_term" | "long_term";
  rationale: string;
  priority: "high" | "medium" | "low";
  objectionHandling?: string;
  nextSteps: string[];
}

class RecommendationsService {
  async generateRecommendations(
    input: RecommendationInput
  ): Promise<SalesRecommendation> {
    const { profile, transcript } = input;

    console.log(
      `💡 Generating recommendations for ${profile.profile} profile: "${transcript}"`
    );

    // For now, use template-based recommendations (reliable and fast)
    console.log("📋 Using template-based recommendations");
    return this.generateTemplateRecommendations(input);
  }

  private generateTemplateRecommendations(
    input: RecommendationInput
  ): SalesRecommendation {
    const { profile, transcript } = input;

    const templates = {
      PRAGMATICO: {
        immediateAction: "Seja direto e apresente resultados concretos",
        approach: "Foque em ROI e eficiência. Use senso de urgência apropriado",
        suggestedScript:
          "Baseado no que você mencionou, nossos clientes veem ROI de 200% em 6 meses. Quando podemos agendar a implementação?",
        timing: "immediate" as const,
        rationale:
          "Perfil pragmático valoriza decisões rápidas e resultados tangíveis",
        priority: "high" as const,
        objectionHandling:
          "Apresente números concretos e casos de sucesso similares",
        nextSteps: [
          "Apresentar proposta com ROI detalhado",
          "Definir cronograma de implementação",
          "Agendar reunião para fechamento",
        ],
      },

      INTUITIVO: {
        immediateAction: "Demonstre entusiasmo e visão de futuro",
        approach: "Foque em inovação, possibilidades e reconhecimento",
        suggestedScript:
          "Imagino como essa solução pode transformar completamente sua operação e colocá-los à frente da concorrência!",
        timing: "immediate" as const,
        rationale: "Perfil intuitivo se conecta com visão de futuro e inovação",
        priority: "high" as const,
        objectionHandling:
          "Enfatize a exclusividade e o pioneirismo da solução",
        nextSteps: [
          "Apresentar casos de inovação similares",
          "Mostrar visão de futuro com a solução",
          "Criar senso de exclusividade",
        ],
      },

      ANALITICO: {
        immediateAction: "Forneça dados detalhados e evidências",
        approach: "Apresente informações técnicas e permita tempo para análise",
        suggestedScript:
          "Entendo sua necessidade de análise. Tenho aqui um case study detalhado com métricas de cliente similar. Posso compartilhar os dados completos?",
        timing: "short_term" as const,
        rationale:
          "Perfil analítico precisa de dados concretos e tempo para avaliar",
        priority: "medium" as const,
        objectionHandling:
          "Ofereça mais dados, estudos de caso e período de teste",
        nextSteps: [
          "Enviar documentação técnica detalhada",
          "Agendar demo técnica",
          "Oferecer período de piloto",
        ],
      },

      INTEGRADOR: {
        immediateAction: "Enfatize benefícios para equipe e relacionamentos",
        approach: "Foque no impacto nas pessoas e construa consenso",
        suggestedScript:
          "Entendo sua preocupação com a equipe. Nossa solução facilita o trabalho de todos. Que tal um workshop para alinhar os envolvidos?",
        timing: "short_term" as const,
        rationale: "Perfil integrador valoriza impacto positivo nas pessoas",
        priority: "medium" as const,
        objectionHandling:
          "Foque em suporte, treinamento e benefícios colaborativos",
        nextSteps: [
          "Organizar workshop com a equipe",
          "Apresentar plano de treinamento",
          "Destacar suporte continuado",
        ],
      },
    };

    const template = templates[profile.profile] || templates.ANALITICO;

    console.log(
      `✅ Template recommendation for ${profile.profile}: ${template.immediateAction}`
    );

    return template;
  }
}

export const recommendationsService = new RecommendationsService();
