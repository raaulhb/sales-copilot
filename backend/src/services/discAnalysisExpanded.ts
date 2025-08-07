import {
  ExpandedDISCProfile,
  FDNASubtype,
  BehavioralAxes,
} from "../types/behavioral";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class DISCAnalysisExpanded {
  // Mapeamento de perfis DISC para subtipos FDNA possíveis
  private static readonly FDNA_SUBTYPES_MAP = {
    PRAGMATICO: ["Empreendedor", "Estrategista", "Ponderador"],
    INTUITIVO: [
      "Influenciador",
      "Engajador",
      "Agregador",
      "Formador de relacionamentos",
    ],
    ANALITICO: ["Pensador entusiasta", "Adaptador"],
    INTEGRADOR: ["Facilitador"],
  } as const;

  static async analyzeExpandedDISC(
    transcript: string
  ): Promise<ExpandedDISCProfile> {
    const prompt = this.createExpandedDISCPrompt(transcript);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em análise comportamental DISC com conhecimento profundo da metodologia FDNA. Analise com precisão e forneça respostas no formato JSON solicitado.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      return this.validateAndFormatResponse(analysis);
    } catch (error) {
      console.error("❌ [STAGING] Error in expanded DISC analysis:", error);
      // Fallback para análise básica
      return this.getFallbackDISCProfile(transcript);
    }
  }

  private static createExpandedDISCPrompt(transcript: string): string {
    return `
Analise a seguinte conversa de vendas e identifique o perfil comportamental DISC expandido com metodologia FDNA:

TEXTO DA CONVERSA:
"${transcript}"

Analise e determine:

1. PERFIL DISC PRINCIPAL:
   - Pragmático: Orientado por resultados, direto, focado em eficiência
   - Intuitivo: Sociável, expressivo, busca aprovação social  
   - Analítico: Preciso, sistemático, busca informações detalhadas
   - Integrador: Paciente, confiável, busca harmonia e estabilidade

2. SUBTIPO FDNA ESPECÍFICO:
   - Pragmático: Empreendedor (inovador, assume riscos) | Estrategista (planejador, visionário) | Ponderador (cauteloso, avalia riscos)
   - Intuitivo: Influenciador (persuasivo, carismático) | Engajador (animado, otimista) | Agregador (conecta pessoas) | Formador de relacionamentos (empático, socialmente hábil)
   - Analítico: Pensador entusiasta (curioso, quer entender tudo) | Adaptador (flexível, se ajusta às situações)
   - Integrador: Facilitador (mediador, cria consenso)

3. EIXOS COMPORTAMENTAIS FDNA (-100 a +100):
   - ATAQUE/DEFESA: Orientação por resultados vs comportamento cauteloso
   - RAZÃO/EMOÇÃO: Orientação por relacionamentos vs lógica pura

4. CARACTERÍSTICAS COMPORTAMENTAIS:
   - 3-5 traços primários observados
   - Estilo de comunicação predominante  
   - 2-3 fatores principais de motivação

RESPONDA EM JSON:
{
  "type": "PRAGMATICO|INTUITIVO|ANALITICO|INTEGRADOR",
  "confidence": <0-100>,
  "reasoning": "<justificativa detalhada baseada em evidências do texto>",
  "subtype": "<subtipo FDNA específico>",
  "behavioralAxes": {
    "attackDefense": <-100 a +100>,
    "reasonEmotion": <-100 a +100>
  },
  "fdnaDetails": {
    "primaryTraits": ["<trait1>", "<trait2>", "<trait3>"],
    "communicationStyle": "<descrição do estilo>",
    "motivationFactors": ["<fator1>", "<fator2>"]
  }
}
    `;
  }

  private static validateAndFormatResponse(analysis: any): ExpandedDISCProfile {
    // Validação e formatação da resposta com tipos corretos
    const discType = analysis.type || "PRAGMATICO";

    // Type assertion para garantir que discType seja uma chave válida
    const validDiscType = discType as keyof typeof this.FDNA_SUBTYPES_MAP;
    const subtypeOptions = this.FDNA_SUBTYPES_MAP[validDiscType];
    const subtype =
      analysis.subtype || (subtypeOptions ? subtypeOptions[0] : "Empreendedor");

    return {
      type: validDiscType,
      confidence: Math.max(0, Math.min(100, analysis.confidence || 70)),
      reasoning:
        analysis.reasoning ||
        "Análise baseada em padrões de comunicação identificados.",
      subtype: subtype as FDNASubtype,
      behavioralAxes: {
        attackDefense: Math.max(
          -100,
          Math.min(100, analysis.behavioralAxes?.attackDefense || 0)
        ),
        reasonEmotion: Math.max(
          -100,
          Math.min(100, analysis.behavioralAxes?.reasonEmotion || 0)
        ),
      },
      fdnaDetails: {
        primaryTraits: analysis.fdnaDetails?.primaryTraits || [
          "Comunicativo",
          "Focado",
          "Analítico",
        ],
        communicationStyle:
          analysis.fdnaDetails?.communicationStyle || "Direto e objetivo",
        motivationFactors: analysis.fdnaDetails?.motivationFactors || [
          "Resultados",
          "Eficiência",
        ],
      },
    };
  }

  private static getFallbackDISCProfile(
    transcript: string
  ): ExpandedDISCProfile {
    // Análise básica de fallback baseada em palavras-chave
    const pragmaticoKeywords = [
      "resultado",
      "eficiente",
      "rápido",
      "direto",
      "objetivo",
    ];
    const intuitivoKeywords = [
      "pessoas",
      "relacionamento",
      "sentir",
      "emoção",
      "conectar",
    ];
    const analiticoKeywords = [
      "dados",
      "análise",
      "detalhe",
      "informação",
      "estudo",
    ];
    const integradorKeywords = [
      "equipe",
      "consenso",
      "harmonia",
      "estável",
      "confiança",
    ];

    const lowerTranscript = transcript.toLowerCase();
    const scores = {
      PRAGMATICO: pragmaticoKeywords.filter((k) => lowerTranscript.includes(k))
        .length,
      INTUITIVO: intuitivoKeywords.filter((k) => lowerTranscript.includes(k))
        .length,
      ANALITICO: analiticoKeywords.filter((k) => lowerTranscript.includes(k))
        .length,
      INTEGRADOR: integradorKeywords.filter((k) => lowerTranscript.includes(k))
        .length,
    };

    const topProfileEntry = Object.entries(scores).sort(
      ([, a], [, b]) => b - a
    )[0];
    const topProfile =
      topProfileEntry[0] as keyof typeof this.FDNA_SUBTYPES_MAP;
    const subtypeOptions = this.FDNA_SUBTYPES_MAP[topProfile];

    return {
      type: topProfile,
      confidence: 60,
      reasoning:
        "Análise de fallback baseada em palavras-chave identificadas no texto.",
      subtype: (subtypeOptions
        ? subtypeOptions[0]
        : "Empreendedor") as FDNASubtype,
      behavioralAxes: {
        attackDefense: topProfile === "PRAGMATICO" ? 50 : -20,
        reasonEmotion: topProfile === "INTUITIVO" ? 50 : -30,
      },
      fdnaDetails: {
        primaryTraits: ["Comunicativo", "Focado"],
        communicationStyle: "Estilo padrão identificado",
        motivationFactors: ["Resultados", "Relacionamentos"],
      },
    };
  }
}
