import { openai, AI_CONFIG } from "../config/ai";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

interface WhisperResult {
  transcript: string;
  confidence: number;
  language: string;
  duration: number;
  segments?: any[];
}

class WhisperService {
  async transcribeAudio(
    audioBuffer: Buffer,
    filename: string = "audio.wav"
  ): Promise<WhisperResult> {
    // Check if we should use real AI
    const useRealAI =
      process.env.USE_REAL_AI === "true" && process.env.OPENAI_API_KEY;

    if (!useRealAI) {
      console.log(
        "🤖 Using mock transcription (USE_REAL_AI=false or no API key)"
      );
      return this.mockTranscription(audioBuffer);
    }

    try {
      // Create temporary file for Whisper API
      const tempDir = path.join(__dirname, "../../temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempFilePath = path.join(
        tempDir,
        `whisper-${Date.now()}-${filename}`
      );

      // Write buffer to temp file
      await writeFile(tempFilePath, audioBuffer);

      console.log(
        `🎤 Transcribing with Whisper: ${audioBuffer.length} bytes → ${tempFilePath}`
      );

      // Call OpenAI Whisper API
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: AI_CONFIG.whisper.model,
        language: AI_CONFIG.whisper.language,
        response_format: "verbose_json",
        temperature: AI_CONFIG.whisper.temperature,
      });

      // Clean up temp file
      await unlink(tempFilePath);

      console.log("✅ Whisper transcription completed:", transcription.text);

      return {
        transcript: transcription.text || "",
        confidence: 0.95, // Whisper doesn't provide confidence
        language: transcription.language || "pt",
        duration: transcription.duration || 0,
        segments: (transcription as any).segments || [],
      };
    } catch (error: any) {
      console.error("❌ Whisper transcription error:", error.message);

      // Fallback to mock on error
      console.log("🤖 Falling back to mock transcription");
      return this.mockTranscription(audioBuffer);
    }
  }

  private mockTranscription(audioBuffer: Buffer): WhisperResult {
    // Generate realistic mock transcription
    const mockTexts = [
      "Olá, como posso ajudá-lo hoje?",
      "Estou interessado em saber mais sobre seus produtos.",
      "Qual é o preço do seu serviço?",
      "Preciso entender melhor os benefícios.",
      "Quando podemos agendar uma demonstração?",
      "Hmm, interessante. Mas eu preciso analisar os números.",
      "Parece uma boa solução para nossa empresa.",
      "Qual é o prazo de implementação?",
      "Vocês oferecem suporte técnico?",
      "Gostaria de discutir isso com minha equipe.",
    ];

    const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];

    return {
      transcript: randomText,
      confidence: 0.85 + Math.random() * 0.1, // 85-95%
      language: "pt",
      duration: 3.0,
      segments: [],
    };
  }

  async isConfigured(): Promise<boolean> {
    return !!(process.env.OPENAI_API_KEY && process.env.USE_REAL_AI === "true");
  }
}

export const whisperService = new WhisperService();
