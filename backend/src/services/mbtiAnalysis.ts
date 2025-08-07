import { MBTIProfile, MBTIType, MBTIDimensions } from "../types/behavioral";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class MBTIAnalysis {
  // Descrições detalhadas dos 16 tipos MBTI
  private static readonly MBTI_DESCRIPTIONS = {
    ENFP: {
      description:
        "Entusiasta, criativo e sociável. Busca possibilidades e inspira outros.",
      strengths: [
        "Criatividade",
        "Entusiasmo",
        "Flexibilidade",
        "Conexão pessoal",
      ],
      developmentAreas: [
        "Foco em detalhes",
        "Planejamento estruturado",
        "Follow-through",
      ],
    },
    ENFJ: {
      description:
        "Carismático e inspirador. Natural líder focado no desenvolvimento das pessoas.",
      strengths: ["Liderança", "Empatia", "Comunicação", "Visão de futuro"],
      developmentAreas: [
        "Objetividade",
        "Tomada de decisões difíceis",
        "Autocuidado",
      ],
    },
    ENTP: {
      description:
        "Inovador e questionador. Adora debater ideias e explorar possibilidades.",
      strengths: [
        "Inovação",
        "Pensamento estratégico",
        "Adaptabilidade",
        "Networking",
      ],
      developmentAreas: [
        "Execução consistente",
        "Atenção aos detalhes",
        "Rotina",
      ],
    },
    ENTJ: {
      description:
        "Líder natural, estratégico e determinado. Foca em eficiência e resultados.",
      strengths: ["Liderança", "Estratégia", "Decisão", "Organização"],
      developmentAreas: [
        "Paciência",
        "Sensibilidade interpessoal",
        "Flexibilidade",
      ],
    },
    ESFP: {
      description:
        "Espontâneo e amigável. Traz energia positiva e foca no momento presente.",
      strengths: [
        "Espontaneidade",
        "Otimismo",
        "Relacionamento",
        "Adaptabilidade",
      ],
      developmentAreas: [
        "Planejamento de longo prazo",
        "Disciplina",
        "Análise crítica",
      ],
    },
    ESFJ: {
      description:
        "Prestativo e organizado. Focado em atender necessidades dos outros.",
      strengths: ["Organização", "Lealdade", "Suporte", "Responsabilidade"],
      developmentAreas: ["Assertividade", "Mudanças", "Crítica construtiva"],
    },
    ESTP: {
      description: "Pragmático e energético. Prefere ação a planejamento.",
      strengths: [
        "Ação imediata",
        "Pragmatismo",
        "Flexibilidade",
        "Solução de problemas",
      ],
      developmentAreas: [
        "Planejamento estratégico",
        "Paciência",
        "Teoria abstrata",
      ],
    },
    ESTJ: {
      description: "Organizador natural, sistemático e focado em resultados.",
      strengths: ["Organização", "Liderança", "Eficiência", "Confiabilidade"],
      developmentAreas: [
        "Flexibilidade",
        "Inovação",
        "Sensibilidade emocional",
      ],
    },
    INFP: {
      description:
        "Idealista e autêntico. Busca significado e harmonia com valores pessoais.",
      strengths: ["Autenticidade", "Criatividade", "Empatia", "Valores fortes"],
      developmentAreas: ["Assertividade", "Decisões práticas", "Estrutura"],
    },
    INFJ: {
      description:
        "Visionário e determinado. Combina intuição com planejamento estruturado.",
      strengths: ["Visão de futuro", "Determinação", "Insight", "Planejamento"],
      developmentAreas: ["Flexibilidade", "Praticidade", "Assertividade"],
    },
    INTP: {
      description:
        "Pensador lógico e independente. Busca compreender sistemas complexos.",
      strengths: ["Lógica", "Análise", "Independência", "Inovação"],
      developmentAreas: ["Expressão emocional", "Prazos", "Implementação"],
    },
    INTJ: {
      description:
        "Estrategista independente. Combina visão de longo prazo com determinação.",
      strengths: [
        "Estratégia",
        "Independência",
        "Visão sistêmica",
        "Determinação",
      ],
      developmentAreas: [
        "Relacionamento interpessoal",
        "Flexibilidade",
        "Trabalho em equipe",
      ],
    },
    ISFP: {
      description: "Artístico e sensível. Valoriza autenticidade e harmonia.",
      strengths: ["Sensibilidade", "Flexibilidade", "Lealdade", "Criatividade"],
      developmentAreas: ["Assertividade", "Planejamento", "Confronto"],
    },
    ISFJ: {
      description:
        "Protetor dedicado e confiável. Focado em apoiar e cuidar dos outros.",
      strengths: [
        "Dedicação",
        "Confiabilidade",
        "Atenção aos detalhes",
        "Suporte",
      ],
      developmentAreas: ["Assertividade", "Mudanças", "Autocuidado"],
    },
    ISTP: {
      description:
        "Solucionador prático e adaptável. Prefere trabalhar com as mãos.",
      strengths: [
        "Solução prática",
        "Adaptabilidade",
        "Independência",
        "Calma",
      ],
      developmentAreas: [
        "Expressão emocional",
        "Planejamento",
        "Relacionamento",
      ],
    },
    ISTJ: {
      description:
        "Responsável e sistemático. Valoriza tradição, lealdade e hard work.",
      strengths: [
        "Responsabilidade",
        "Organização",
        "Confiabilidade",
        "Atenção aos detalhes",
      ],
      developmentAreas: ["Flexibilidade", "Inovação", "Expressão pessoal"],
    },
  } as const;

  static async analyzeMBTI(transcript: string): Promise<MBTIProfile> {
    const prompt = this.createMBTIPrompt(transcript);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em análise de personalidade MBTI. Analise o texto e determine o tipo de personalidade baseado nas 4 dimensões: E/I, S/N, T/F, J/P. Seja preciso e forneça evidências textuais.",
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
      return this.validateAndFormatMBTIResponse(analysis);
    } catch (error) {
      console.error("❌ [STAGING] Error in MBTI analysis:", error);
      return this.getFallbackMBTIProfile(transcript);
    }
  }

  private static createMBTIPrompt(transcript: string): string {
    return `
Analise a seguinte conversa e determine o tipo MBTI da pessoa baseado nas 4 dimensões:

TEXTO DA CONVERSA:
"${transcript}"

Analise cada dimensão e forneça um score de -100 a +100:

1. EXTROVERSÃO vs INTROVERSÃO (E/I):
   - +100: Muito extrovertido (energizado por pessoas, fala para processar, busca estímulos externos)
   - -100: Muito introvertido (energizado pela reflexão, pensa antes de falar, prefere profundidade)

2. SENSAÇÃO vs INTUIÇÃO (S/N):
   - +100: Muito sensorial (fatos concretos, experiência prática, detalhes, presente)
   - -100: Muito intuitivo (possibilidades, padrões, futuro, conceitos abstratos)

3. PENSAMENTO vs SENTIMENTO (T/F):
   - +100: Muito pensador (lógica, objetividade, crítica, eficiência)
   - -100: Muito sentimental (valores, harmonia, pessoas, impacto emocional)

4. JULGAMENTO vs PERCEPÇÃO (J/P):
   - +100: Muito julgador (estrutura, planejamento, decisões, cronogramas)
   - -100: Muito perceptivo (flexibilidade, espontaneidade, adaptação, opções abertas)

Determine o tipo MBTI final (ex: ENFP, INTJ) e forneça evidências específicas do texto.

RESPONDA EM JSON:
{
  "dimensions": {
    "extroversion": <-100 a +100>,
    "sensing": <-100 a +100>,
    "thinking": <-100 a +100>,
    "judging": <-100 a +100>
  },
  "type": "<tipo MBTI de 4 letras>",
  "confidence": <0-100>,
  "evidences": {
    "extroversion": "<evidência textual para E/I>",
    "sensing": "<evidência textual para S/N>",
    "thinking": "<evidência textual para T/F>",
    "judging": "<evidência textual para J/P>"
  }
}
    `;
  }

  private static validateAndFormatMBTIResponse(analysis: any): MBTIProfile {
    const dimensions = analysis.dimensions || {};
    const type = this.calculateMBTIType(dimensions);
    const typeInfo =
      this.MBTI_DESCRIPTIONS[type as keyof typeof this.MBTI_DESCRIPTIONS];

    return {
      type: type as MBTIType,
      dimensions: {
        extroversion: Math.max(
          -100,
          Math.min(100, dimensions.extroversion || 0)
        ),
        sensing: Math.max(-100, Math.min(100, dimensions.sensing || 0)),
        thinking: Math.max(-100, Math.min(100, dimensions.thinking || 0)),
        judging: Math.max(-100, Math.min(100, dimensions.judging || 0)),
      },
      confidence: Math.max(0, Math.min(100, analysis.confidence || 70)),
      description:
        typeInfo?.description ||
        "Personalidade equilibrada com características mistas.",
      strengths: typeInfo?.strengths
        ? [...typeInfo.strengths]
        : ["Comunicação", "Adaptabilidade"],
      developmentAreas: typeInfo?.developmentAreas
        ? [...typeInfo.developmentAreas]
        : ["Autoconhecimento", "Feedback"],
    };
  }

  private static calculateMBTIType(dimensions: MBTIDimensions): string {
    const e_i = dimensions.extroversion > 0 ? "E" : "I";
    const s_n = dimensions.sensing > 0 ? "S" : "N";
    const t_f = dimensions.thinking > 0 ? "T" : "F";
    const j_p = dimensions.judging > 0 ? "J" : "P";

    return `${e_i}${s_n}${t_f}${j_p}`;
  }

  private static getFallbackMBTIProfile(transcript: string): MBTIProfile {
    // Análise básica de fallback
    return {
      type: "ENFP" as MBTIType,
      dimensions: {
        extroversion: 20,
        sensing: -10,
        thinking: -5,
        judging: -15,
      },
      confidence: 60,
      description:
        "Análise de fallback - perfil equilibrado com tendências colaborativas.",
      // ✅ CORRIGIR: Arrays simples (já são mutáveis)
      strengths: ["Comunicação", "Adaptabilidade", "Criatividade"],
      developmentAreas: ["Estruturação", "Foco", "Planejamento"],
    };
  }
}
