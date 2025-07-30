interface TranscriptionResult {
  transcript: string;
  confidence: number;
  timestamp: number;
  duration: number;
}

interface SpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

class SpeechToTextService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    // Check if browser supports Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "pt-BR"; // Portuguese Brazil
    this.recognition.maxAlternatives = 1;
  }

  async startTranscription(
    options: SpeechToTextOptions = {},
    onResult: (result: TranscriptionResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser");
      return;
    }

    if (this.isListening) {
      console.log("Already listening...");
      return;
    }

    // Configure options
    this.recognition.continuous = options.continuous ?? true;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.lang = options.language ?? "pt-BR";

    // Setup event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log("🎤 Speech recognition started");
    };

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0.5;

      const transcriptionResult: TranscriptionResult = {
        transcript: transcript.trim(),
        confidence,
        timestamp: Date.now(),
        duration: 0, // Will be calculated later
      };

      onResult(transcriptionResult);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      onError(`Speech recognition error: ${event.error}`);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log("🎤 Speech recognition ended");
    };

    try {
      this.recognition.start();
    } catch (error) {
      onError("Failed to start speech recognition");
      this.isListening = false;
    }
  }

  stopTranscription(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log("🛑 Speech recognition stopped");
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  isActive(): boolean {
    return this.isListening;
  }

  // Alternative: Send audio to backend for transcription
  async transcribeAudioBlob(audioBlob: Blob): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await fetch(
        "http://localhost:3001/api/audio/transcribe",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        transcript: result.data.transcript,
        confidence: result.data.confidence || 0.8,
        timestamp: Date.now(),
        duration: result.data.duration || 0,
      };
    } catch (error) {
      console.error("Transcription error:", error);
      throw new Error("Failed to transcribe audio");
    }
  }
}

// Add types for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const speechToTextService = new SpeechToTextService();
export type { TranscriptionResult, SpeechToTextOptions };
