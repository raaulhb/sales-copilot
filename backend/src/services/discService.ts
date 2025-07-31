import { DiscProfile, AudioFeatures } from "../types";
import { openai, AI_CONFIG } from "../config/ai";

interface DiscAnalysisInput {
  transcript: string;
  audioFeatures?: AudioFeatures;
  conversationHistory?: string[];
  speakerId?: "seller" | "client" | "unknown";
}

interface AnalysisResult {
  profile: DiscProfile;
  indicators: string[];
  reasoning: string;
}

class DiscService {
  async analyzeProfile(input: DiscAnalysisInput): Promise<DiscProfile> {
    const { transcript, audioFeatures, conversationHistory, speakerId } = input;

    console.log(
      `🧠 Analyzing DISC profile for ${speakerId || "unknown"}: "${transcript}"`
    );

    // Check if we should use real GPT-4 AI
    const useRealAI =
      process.env.USE_REAL_AI === "true" && process.env.OPENAI_API_KEY;

    if (useRealAI) {
      try {
        console.log("🤖 Using GPT-4 for DISC analysis");
        const result = await this.performGPTAnalysis(input);

        console.log(
          `✅ GPT-4 DISC Analysis completed: ${result.profile.profile} (${result.profile.confidence}% confidence)`
        );
        console.log(`📊 GPT Indicators: ${result.indicators.join(", ")}`);
        console.log(`💭 GPT Reasoning: ${result.reasoning}`);

        return result.profile;
      } catch (error: any) {
        console.error(
          "❌ GPT-4 analysis failed, falling back to mock:",
          error.message
        );
        // Fall through to mock analysis
      }
    }

    // Use mock analysis (existing code)
    console.log("🤖 Using mock DISC analysis");
    const result = this.performMockAnalysis(input);

    console.log(
      `✅ Mock DISC Analysis completed: ${result.profile.profile} (${result.profile.confidence}% confidence)`
    );
    console.log(`📊 Mock Indicators: ${result.indicators.join(", ")}`);
    console.log(`💭 Mock Reasoning: ${result.reasoning}`);

    return result.profile;
  }

  private performMockAnalysis(input: DiscAnalysisInput): AnalysisResult {
    const { transcript, audioFeatures, speakerId } = input;

    // Calculate assertiveness and emotionality scores
    const assertiveness = this.calculateAssertiveness(
      transcript,
      audioFeatures
    );
    const emotionality = this.calculateEmotionality(transcript, audioFeatures);

    // Determine profile based on quadrant
    const profile = this.mapToProfile(assertiveness, emotionality);

    // Calculate confidence based on strength of indicators
    const confidence = this.calculateConfidence(
      transcript,
      audioFeatures,
      assertiveness,
      emotionality
    );

    // Get specific indicators that led to this analysis
    const indicators = this.getProfileIndicators(
      transcript,
      audioFeatures,
      profile
    );

    // Generate reasoning explanation
    const reasoning = this.generateReasoning(
      transcript,
      profile,
      assertiveness,
      emotionality,
      indicators
    );

    return {
      profile: {
        assertiveness,
        emotionality,
        profile,
        confidence,
      },
      indicators,
      reasoning,
    };
  }

  private calculateAssertiveness(
    transcript: string,
    audioFeatures?: AudioFeatures
  ): number {
    let score = 0;
    const lowerTranscript = transcript.toLowerCase();

    // Assertive language indicators (+)
    const assertiveWords = [
      "quero",
      "vou",
      "preciso",
      "tenho que",
      "vamos",
      "decidir",
      "agora",
      "já",
      "imediatamente",
      "rápido",
      "urgente",
      "faço",
      "implemento",
      "resolvo",
      "garanto",
      "certamente",
      "obviamente",
      "claramente",
      "definitivamente",
    ];

    // Question/hesitation indicators (-)
    const questionWords = [
      "como",
      "quando",
      "onde",
      "por que",
      "qual",
      "quais",
      "posso",
      "poderia",
      "seria possível",
      "talvez",
      "acho que",
      "parece",
      "pode ser",
      "não sei",
      "será que",
      "gostaria",
    ];

    // Count assertive words
    assertiveWords.forEach((word) => {
      const matches = (lowerTranscript.match(new RegExp(word, "g")) || [])
        .length;
      score += matches * 15;
    });

    // Subtract for question words
    questionWords.forEach((word) => {
      const matches = (lowerTranscript.match(new RegExp(word, "g")) || [])
        .length;
      score -= matches * 10;
    });

    // Audio-based indicators
    if (audioFeatures) {
      if (audioFeatures.pace > 160) score += 15; // Fast speech = assertive
      if (audioFeatures.volume > 75) score += 10; // Loud = assertive
      if (audioFeatures.pauseFrequency < 2) score += 12; // Few pauses = assertive
      if (audioFeatures.energy > 80) score += 8; // High energy = assertive
    }

    // Sentence structure analysis
    const sentences = transcript
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    const statements = sentences.filter((s) => !s.trim().endsWith("?")).length;
    const questions = sentences.filter((s) => s.trim().endsWith("?")).length;

    if (statements > questions) score += 10;
    if (questions > statements) score -= 8;

    return Math.max(-100, Math.min(100, score));
  }

  private calculateEmotionality(
    transcript: string,
    audioFeatures?: AudioFeatures
  ): number {
    let score = 0;
    const lowerTranscript = transcript.toLowerCase();

    // Emotional words (+)
    const emotionalWords = [
      "sinto",
      "sentir",
      "emocionante",
      "incrível",
      "fantástico",
      "maravilhoso",
      "preocupado",
      "animado",
      "empolgado",
      "feliz",
      "triste",
      "nervoso",
      "pessoas",
      "equipe",
      "time",
      "juntos",
      "colaboração",
      "relacionamento",
      "amor",
      "paixão",
      "sonho",
      "esperança",
      "medo",
      "alegria",
      "experiência",
      "vivência",
      "impacto",
      "transformação",
    ];

    // Rational words (-)
    const rationalWords = [
      "dados",
      "números",
      "estatística",
      "análise",
      "lógico",
      "racional",
      "calculado",
      "medido",
      "quantificado",
      "métrica",
      "indicador",
      "evidência",
      "prova",
      "fato",
      "realidade",
      "objetivo",
      "concreto",
      "método",
      "processo",
      "sistema",
      "estrutura",
      "organizado",
      "eficiência",
      "produtividade",
      "resultado",
      "performance",
    ];

    // Count emotional words
    emotionalWords.forEach((word) => {
      const matches = (lowerTranscript.match(new RegExp(word, "g")) || [])
        .length;
      score += matches * 12;
    });

    // Subtract for rational words
    rationalWords.forEach((word) => {
      const matches = (lowerTranscript.match(new RegExp(word, "g")) || [])
        .length;
      score -= matches * 10;
    });

    // Audio-based emotional indicators
    if (audioFeatures) {
      switch (audioFeatures.emotionalTone) {
        case "positive":
          score += 20;
          break;
        case "negative":
          score += 15; // Negative emotions are still emotions
          break;
        case "mixed":
          score += 10;
          break;
        case "neutral":
          score -= 5;
          break;
      }

      if (audioFeatures.energy > 70) score += 12; // High energy = emotional
      if (audioFeatures.pitch > 200) score += 8; // High pitch = emotional
    }

    // Exclamation marks and emotional punctuation
    const exclamations = (transcript.match(/[!]/g) || []).length;
    score += exclamations * 8;

    return Math.max(-100, Math.min(100, score));
  }

  private mapToProfile(
    assertiveness: number,
    emotionality: number
  ): DiscProfile["profile"] {
    // DISC quadrant mapping
    if (assertiveness > 10 && emotionality < -10) return "PRAGMATICO";
    if (assertiveness > 10 && emotionality > 10) return "INTUITIVO";
    if (assertiveness < -10 && emotionality < -10) return "ANALITICO";
    if (assertiveness < -10 && emotionality > 10) return "INTEGRADOR";

    // Handle edge cases (close to center)
    if (Math.abs(assertiveness) <= 10 && Math.abs(emotionality) <= 10) {
      // If close to center, use slight tendencies
      if (assertiveness >= 0 && emotionality >= 0) return "INTUITIVO";
      if (assertiveness >= 0 && emotionality < 0) return "PRAGMATICO";
      if (assertiveness < 0 && emotionality >= 0) return "INTEGRADOR";
      return "ANALITICO";
    }

    // Handle cases where one axis is dominant
    if (Math.abs(assertiveness) > Math.abs(emotionality)) {
      return assertiveness > 0 ? "PRAGMATICO" : "ANALITICO";
    } else {
      return emotionality > 0 ? "INTUITIVO" : "PRAGMATICO";
    }
  }

  private calculateConfidence(
    transcript: string,
    audioFeatures?: AudioFeatures,
    assertiveness?: number,
    emotionality?: number
  ): number {
    let confidence = 50; // Base confidence

    // Text length increases confidence
    if (transcript.length > 50) confidence += 10;
    if (transcript.length > 100) confidence += 10;
    if (transcript.length > 200) confidence += 10;

    // Audio features increase confidence
    if (audioFeatures) confidence += 15;

    // Strong scores increase confidence
    if (assertiveness && Math.abs(assertiveness) > 30) confidence += 10;
    if (emotionality && Math.abs(emotionality) > 30) confidence += 10;

    // Very strong scores increase confidence more
    if (assertiveness && Math.abs(assertiveness) > 60) confidence += 15;
    if (emotionality && Math.abs(emotionality) > 60) confidence += 15;

    // Multiple indicators increase confidence
    const wordCount = transcript.split(/\s+/).length;
    if (wordCount > 10) confidence += 5;
    if (wordCount > 20) confidence += 5;

    return Math.max(30, Math.min(95, confidence));
  }

  private getProfileIndicators(
    transcript: string,
    audioFeatures?: AudioFeatures,
    profile?: DiscProfile["profile"]
  ): string[] {
    const indicators: string[] = [];
    const lowerTranscript = transcript.toLowerCase();

    switch (profile) {
      case "PRAGMATICO":
        if (lowerTranscript.includes("quanto"))
          indicators.push("Pergunta sobre custos/valores");
        if (lowerTranscript.includes("quando"))
          indicators.push("Foco em timing/prazos");
        if (lowerTranscript.includes("resultado"))
          indicators.push("Orientação a resultados");
        if (
          lowerTranscript.includes("rápido") ||
          lowerTranscript.includes("agora")
        ) {
          indicators.push("Senso de urgência");
        }
        if (audioFeatures?.pace && audioFeatures.pace > 160) {
          indicators.push("Ritmo de fala acelerado");
        }
        break;

      case "INTUITIVO":
        if (
          lowerTranscript.includes("incrível") ||
          lowerTranscript.includes("fantástico")
        ) {
          indicators.push("Linguagem entusiástica");
        }
        if (
          lowerTranscript.includes("futuro") ||
          lowerTranscript.includes("visão")
        ) {
          indicators.push("Orientação ao futuro");
        }
        if (
          lowerTranscript.includes("inovar") ||
          lowerTranscript.includes("transformar")
        ) {
          indicators.push("Foco em inovação");
        }
        if (audioFeatures?.energy && audioFeatures.energy > 70) {
          indicators.push("Alta energia vocal");
        }
        break;

      case "ANALITICO":
        if (
          lowerTranscript.includes("dados") ||
          lowerTranscript.includes("análise")
        ) {
          indicators.push("Orientação a dados");
        }
        if (
          lowerTranscript.includes("como") ||
          lowerTranscript.includes("por que")
        ) {
          indicators.push("Questionamentos metodológicos");
        }
        if (
          lowerTranscript.includes("certeza") ||
          lowerTranscript.includes("garantir")
        ) {
          indicators.push("Busca por segurança");
        }
        if (audioFeatures?.pauseFrequency && audioFeatures.pauseFrequency > 5) {
          indicators.push("Pausas frequentes (reflexão)");
        }
        break;

      case "INTEGRADOR":
        if (
          lowerTranscript.includes("equipe") ||
          lowerTranscript.includes("pessoas")
        ) {
          indicators.push("Foco nas pessoas");
        }
        if (
          lowerTranscript.includes("sentir") ||
          lowerTranscript.includes("impacto")
        ) {
          indicators.push("Considerações emocionais");
        }
        if (
          lowerTranscript.includes("juntos") ||
          lowerTranscript.includes("colaboração")
        ) {
          indicators.push("Orientação colaborativa");
        }
        if (audioFeatures?.emotionalTone === "positive") {
          indicators.push("Tom emocional positivo");
        }
        break;
    }

    // Add general audio indicators
    if (audioFeatures) {
      if (audioFeatures.volume > 80)
        indicators.push("Volume alto (assertividade)");
      if (audioFeatures.volume < 40) indicators.push("Volume baixo (cautela)");
      if (audioFeatures.pitch > 250) indicators.push("Tom agudo (emoção)");
      if (audioFeatures.pitch < 150) indicators.push("Tom grave (seriedade)");
    }

    // Add text-based indicators
    const questionMarks = (transcript.match(/\?/g) || []).length;
    const exclamationMarks = (transcript.match(/!/g) || []).length;

    if (questionMarks > 0)
      indicators.push(`${questionMarks} pergunta(s) detectada(s)`);
    if (exclamationMarks > 0)
      indicators.push(`${exclamationMarks} exclamação(ões) detectada(s)`);

    return indicators.length > 0
      ? indicators
      : ["Análise baseada em padrões gerais de linguagem"];
  }

  private generateReasoning(
    transcript: string,
    profile: DiscProfile["profile"],
    assertiveness: number,
    emotionality: number,
    indicators: string[]
  ): string {
    const profileDescriptions = {
      PRAGMATICO: "direto e orientado a resultados",
      INTUITIVO: "visionário e entusiasmado",
      ANALITICO: "cauteloso e orientado a dados",
      INTEGRADOR: "colaborativo e empático",
    };

    let reasoning = `Perfil ${profile} identificado (${profileDescriptions[profile]}). `;

    reasoning += `Assertividade: ${
      assertiveness > 0 ? "Alta" : "Baixa"
    } (${assertiveness}), `;
    reasoning += `Emocionalidade: ${
      emotionality > 0 ? "Alta" : "Baixa"
    } (${emotionality}). `;

    if (indicators.length > 0) {
      reasoning += `Principais indicadores: ${indicators
        .slice(0, 3)
        .join(", ")}.`;
    }

    return reasoning;
  }

  // Method for testing different profiles
  async testProfile(profileType: DiscProfile["profile"]): Promise<string> {
    const testPhrases = {
      PRAGMATICO:
        "Preciso saber quanto custa e quando posso ver resultado. Qual é o ROI concreto?",
      INTUITIVO:
        "Isso é incrível! Posso imaginar como isso vai transformar nossa operação completamente.",
      ANALITICO:
        "Interessante, mas preciso analisar os dados. Como vocês garantem esses resultados?",
      INTEGRADOR:
        "Parece bom, mas como isso vai afetar nossa equipe? Preciso discutir com o time.",
    };

    const testPhrase = testPhrases[profileType];
    const result = await this.analyzeProfile({
      transcript: testPhrase,
      speakerId: "client",
    });

    return `Teste ${profileType}: "${testPhrase}" → Resultado: ${result.profile} (${result.confidence}%)`;
  }
  // ========== GPT-4 METHODS ==========

  private async performGPTAnalysis(
    input: DiscAnalysisInput
  ): Promise<AnalysisResult> {
    const { transcript, audioFeatures, conversationHistory, speakerId } = input;

    const prompts = this.buildGPTPrompts(input);

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.gpt.model, // gpt-4o-mini
      temperature: AI_CONFIG.gpt.temperature,
      max_tokens: AI_CONFIG.gpt.max_tokens,
      messages: [
        { role: "system", content: prompts.systemPrompt },
        { role: "user", content: prompts.userPrompt },
      ],
    });

    const analysis = completion.choices[0]?.message?.content;
    if (!analysis) {
      throw new Error("No analysis returned from GPT-4");
    }

    return this.parseGPTResponse(analysis);
  }

  private buildGPTPrompts(input: DiscAnalysisInput) {
    const { transcript, audioFeatures, conversationHistory, speakerId } = input;

    const systemPrompt = `
# EXPERT DISC BEHAVIORAL ANALYST

Você é um especialista mundial em análise comportamental DISC para vendas. Analise a fala fornecida e determine o perfil comportamental com precisão científica.

## METODOLOGIA DISC:

### EIXOS DE ANÁLISE:
1. **ASSERTIVIDADE** (-100 a +100): 
   - POSITIVO: Afirmações diretas, comandos, decisões rápidas
   - NEGATIVO: Perguntas, hesitação, busca por consenso

2. **EMOCIONALIDADE** (-100 a +100):
   - POSITIVO: Emoções, pessoas, sentimentos, relacionamentos
   - NEGATIVO: Dados, lógica, fatos, análise racional

### PERFIS RESULTANTES:

**PRAGMÁTICO** (Assertivo + Racional):
- Linguagem: "quanto custa", "quando", "resultado", "ROI", "decidir agora"
- Comportamento: Direto, impaciente, foco em eficiência
- Motivação: Resultados tangíveis, controle, poder

**INTUITIVO** (Assertivo + Emocional):
- Linguagem: "incrível", "visão", "futuro", "transformar", "inovação"
- Comportamento: Entusiasmado, visionário, energético
- Motivação: Reconhecimento, influência, criatividade

**ANALÍTICO** (Questionador + Racional):
- Linguagem: "como", "por que", "dados", "evidência", "garantia"
- Comportamento: Cauteloso, metódico, busca segurança
- Motivação: Precisão, qualidade, segurança

**INTEGRADOR** (Questionador + Emocional):
- Linguagem: "equipe", "juntos", "como afeta", "sentimento"
- Comportamento: Colaborativo, empático, busca harmonia
- Motivação: Relacionamentos, estabilidade, apoio

## INSTRUÇÕES CRÍTICAS:
1. Analise CADA palavra cuidadosamente
2. Considere o CONTEXTO da conversa de vendas
3. Identifique PADRÕES específicos de cada perfil
4. Seja PRECISO na classificação dos eixos
5. Forneça EVIDÊNCIAS concretas para sua análise

## FORMATO OBRIGATÓRIO:
Retorne APENAS um JSON válido:
{
  "assertiveness": number, // -100 a +100
  "emotionality": number,  // -100 a +100  
  "profile": "PRAGMATICO|INTUITIVO|ANALITICO|INTEGRADOR",
  "confidence": number,    // 0-100
  "indicators": ["evidência 1", "evidência 2", "evidência 3"],
  "reasoning": "Explicação detalhada da análise baseada nas evidências"
}
`;

    const userPrompt = `
# ANÁLISE DISC SOLICITADA

**Transcrição para Análise:**
"${transcript}"

**Contexto da Conversa:**
- Falante: ${
      speakerId === "client"
        ? "CLIENTE (pessoa interessada em comprar)"
        : speakerId === "seller"
          ? "VENDEDOR"
          : "Não identificado"
    }
- Situação: Conversa de vendas/negociação
- Duração do segmento: ~3 segundos

${
  audioFeatures
    ? `
**Características Vocais:**
- Ritmo de fala: ${audioFeatures.pace} palavras/minuto ${
        audioFeatures.pace > 160
          ? "(rápido - indica assertividade)"
          : audioFeatures.pace < 120
            ? "(lento - indica cautela)"
            : "(normal)"
      }
- Volume: ${audioFeatures.volume}/100 ${
        audioFeatures.volume > 70
          ? "(alto - assertivo)"
          : audioFeatures.volume < 50
            ? "(baixo - cauteloso)"
            : "(médio)"
      }
- Energia vocal: ${audioFeatures.energy}/100 ${
        audioFeatures.energy > 70
          ? "(alta energia - emocional)"
          : "(energia moderada)"
      }
- Tom emocional: ${audioFeatures.emotionalTone} ${
        audioFeatures.emotionalTone === "positive"
          ? "(positivo - emocional)"
          : audioFeatures.emotionalTone === "negative"
            ? "(negativo - ainda emocional)"
            : "(neutro - racional)"
      }
`
    : ""
}

${
  conversationHistory && conversationHistory.length > 0
    ? `
**Contexto da Conversa (últimas falas):**
${conversationHistory
  .slice(-3)
  .map((msg, i) => `${i + 1}. "${msg}"`)
  .join("\n")}
`
    : ""
}

**TAREFA:**
Analise esta fala específica no contexto de uma conversa de vendas e determine:
1. O nível de ASSERTIVIDADE (o quanto a pessoa afirma vs pergunta)
2. O nível de EMOCIONALIDADE (o quanto foca em emoções vs dados)
3. O PERFIL DISC resultante
4. As EVIDÊNCIAS específicas que sustentam sua análise

Foque especialmente em:
- Palavras-chave características de cada perfil
- Padrões de pergunta vs afirmação
- Foco em resultados vs processos vs pessoas vs inovação
- Tom e energia da comunicação
`;

    return { systemPrompt, userPrompt };
  }

  private parseGPTResponse(response: string): AnalysisResult {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in GPT response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and clean data
      const profile: DiscProfile = {
        assertiveness: Math.max(-100, Math.min(100, parsed.assertiveness || 0)),
        emotionality: Math.max(-100, Math.min(100, parsed.emotionality || 0)),
        profile: parsed.profile || "ANALITICO",
        confidence: Math.max(0, Math.min(100, parsed.confidence || 70)),
      };

      return {
        profile,
        indicators: Array.isArray(parsed.indicators)
          ? parsed.indicators
          : ["GPT analysis completed"],
        reasoning:
          parsed.reasoning || "Análise baseada em padrões DISC identificados.",
      };
    } catch (error) {
      console.error("❌ Error parsing GPT response:", error);
      console.log("📄 Raw GPT response:", response);

      // Fallback: try to extract basic info
      const fallbackProfile = this.extractFallbackProfile(response);
      return {
        profile: fallbackProfile,
        indicators: ["Análise GPT com parsing manual"],
        reasoning: "Resposta parseada manualmente devido a formato inesperado.",
      };
    }
  }

  private extractFallbackProfile(response: string): DiscProfile {
    // Simple fallback parsing if JSON fails
    const profileMatch = response.match(
      /(PRAGMATICO|INTUITIVO|ANALITICO|INTEGRADOR)/i
    );
    const profile = profileMatch ? profileMatch[1].toUpperCase() : "ANALITICO";

    return {
      assertiveness: 0,
      emotionality: 0,
      profile: profile as DiscProfile["profile"],
      confidence: 60,
    };
  }
}

export const discService = new DiscService();
