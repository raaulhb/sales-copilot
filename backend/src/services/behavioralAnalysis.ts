import { DISCAnalysisExpanded } from "./discAnalysisExpanded";
import { MBTIAnalysis } from "./mbtiAnalysis";
import {
  BehavioralAnalysisResponse,
  ExpandedDISCProfile,
  MBTIProfile,
} from "../types/behavioral";

export class BehavioralAnalysis {
  static async analyzeComplete(
    transcript: string
  ): Promise<BehavioralAnalysisResponse> {
    try {
      console.log(`🧠 [STAGING] Starting complete behavioral analysis...`);

      // Executar análises em paralelo para otimizar performance
      const [discProfile, mbtiProfile] = await Promise.all([
        DISCAnalysisExpanded.analyzeExpandedDISC(transcript),
        MBTIAnalysis.analyzeMBTI(transcript),
      ]);

      // Gerar recomendações combinadas
      const recommendations = this.generateCombinedRecommendations(
        discProfile,
        mbtiProfile,
        transcript
      );

      console.log(`✅ [STAGING] Complete behavioral analysis finished`);

      return {
        transcript,
        profiles: {
          disc: discProfile,
          mbti: mbtiProfile,
        },
        recommendations,
      };
    } catch (error) {
      console.error(
        "❌ [STAGING] Error in complete behavioral analysis:",
        error
      );
      throw error;
    }
  }

  private static generateCombinedRecommendations(
    discProfile: ExpandedDISCProfile,
    mbtiProfile: MBTIProfile,
    transcript: string
  ) {
    // Estratégia baseada no perfil DISC (com tipos corretos)
    const discStrategies: Record<string, string> = {
      PRAGMATICO:
        "Foque em resultados concretos, seja direto e objetivo. Evite detalhes desnecessários.",
      INTUITIVO:
        "Use entusiasmo, conecte-se emocionalmente e mostre o impacto social da solução.",
      ANALITICO:
        "Apresente dados detalhados, estatísticas e evidências. Permita tempo para análise.",
      INTEGRADOR:
        "Construa relacionamento, seja paciente e mostre como a solução beneficia a equipe.",
    };

    // Abordagem baseada no perfil MBTI (com tipos corretos)
    const mbtiApproaches: Record<string, string> = {
      E: "Pessoa extrovertida - engaje em discussão ativa",
      I: "Pessoa introvertida - dê tempo para reflexão",
      S: "Focado em sensação - use exemplos práticos e concretos",
      N: "Focado em intuição - explore possibilidades futuras",
      T: "Pensador - use lógica e análise objetiva",
      F: "Sentimental - enfatize valores e impacto nas pessoas",
      J: "Julgador - seja estruturado e pontual",
      P: "Perceptivo - mantenha flexibilidade e opções",
    };

    const mbtiDominant = mbtiProfile.type.charAt(0); // Primeira letra dominante

    return {
      immediateAction: `Baseado no perfil ${discProfile.type}, ${
        discProfile.subtype
      }: ajuste sua abordagem para ser mais ${discProfile.subtype.toLowerCase()}.`,
      script: `"Entendo que você valoriza ${discProfile.fdnaDetails.motivationFactors[0]}. Deixe-me mostrar como nossa solução atende exatamente isso..."`,
      discBasedStrategy:
        discStrategies[discProfile.type] ||
        "Abordagem personalizada baseada no perfil identificado.",
      mbtiBasedApproach: `${
        mbtiApproaches[mbtiDominant] || "Abordagem equilibrada"
      } - Tipo ${mbtiProfile.type}`,
      combinedInsights: `Cliente ${discProfile.type}/${mbtiProfile.type}: ${discProfile.fdnaDetails.communicationStyle}. ${mbtiProfile.strengths[0]} é um ponto forte para abordar.`,
    };
  }
}
