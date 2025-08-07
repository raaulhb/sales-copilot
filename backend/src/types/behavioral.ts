// Tipos DISC originais (manter compatibilidade)
export type DISCType = "PRAGMATICO" | "INTUITIVO" | "ANALITICO" | "INTEGRADOR";

// FASE 1: Subtipos FDNA expandidos
export type FDNASubtype =
  // Pragmático
  | "Empreendedor"
  | "Estrategista"
  | "Ponderador"
  // Intuitivo
  | "Influenciador"
  | "Engajador"
  | "Agregador"
  | "Formador de relacionamentos"
  // Analítico
  | "Pensador entusiasta"
  | "Adaptador"
  // Integrador
  | "Facilitador";

// Eixos comportamentais FDNA
export interface BehavioralAxes {
  attackDefense: number; // -100 (Defesa) a +100 (Ataque)
  reasonEmotion: number; // -100 (Razão) a +100 (Emoção)
}

// DISC Profile expandido com FDNA
export interface ExpandedDISCProfile {
  // Mantém compatibilidade com sistema atual
  type: DISCType;
  confidence: number;
  reasoning: string;

  // Novos campos FDNA
  subtype: FDNASubtype;
  behavioralAxes: BehavioralAxes;
  fdnaDetails: {
    primaryTraits: string[];
    communicationStyle: string;
    motivationFactors: string[];
  };
}

// FASE 2: Tipos MBTI
export type MBTIType =
  | "ENFP"
  | "ENFJ"
  | "ENTP"
  | "ENTJ"
  | "ESFP"
  | "ESFJ"
  | "ESTP"
  | "ESTJ"
  | "INFP"
  | "INFJ"
  | "INTP"
  | "INTJ"
  | "ISFP"
  | "ISFJ"
  | "ISTP"
  | "ISTJ";

export interface MBTIDimensions {
  extroversion: number; // -100 (I) a +100 (E)
  sensing: number; // -100 (N) a +100 (S)
  thinking: number; // -100 (F) a +100 (T)
  judging: number; // -100 (P) a +100 (J)
}

export interface MBTIProfile {
  type: MBTIType;
  dimensions: MBTIDimensions;
  confidence: number;
  description: string;
  strengths: string[];
  developmentAreas: string[];
}

// Resposta completa da análise comportamental
export interface BehavioralAnalysisResponse {
  transcript: string;
  profiles: {
    disc: ExpandedDISCProfile;
    mbti: MBTIProfile;
  };
  recommendations: {
    immediateAction: string;
    script: string;
    // Recomendações baseadas nos perfis expandidos
    discBasedStrategy: string;
    mbtiBasedApproach: string;
    combinedInsights: string;
  };
}

// Para manter compatibilidade com sistema atual
export interface LegacyDISCProfile {
  type: DISCType;
  confidence: number;
  reasoning: string;
}

export interface LegacyAnalysisResponse {
  success: boolean;
  data: {
    transcript: string;
    profile: LegacyDISCProfile;
    recommendations: {
      immediateAction: string;
      script: string;
    };
  };
}
