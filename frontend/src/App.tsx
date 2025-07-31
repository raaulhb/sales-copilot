import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AudioRecorder from "@/components/features/audio/AudioRecorder";
import LiveTranscription from "@/components/features/audio/LiveTranscription";
import LiveRecommendations from "@/components/features/audio/LiveRecommendations";
import { DiscProfile, TranscriptionResult } from "@/types";
import "./App.css"; // Certifique-se de que este arquivo está vazio ou removido, conforme discutimos anteriormente.

interface HealthCheck {
  success: boolean;
  message: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(false);
  // Nota: O estado 'isRecording' aqui não está sendo atualizado pelo AudioRecorder.
  // Se você precisa que o status de gravação do AudioRecorder seja refletido aqui,
  // o AudioRecorder precisaria expor um callback ou um estado para isso.
  const [isRecording, setIsRecording] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<DiscProfile | null>(
    null
  );
  const [latestTranscript, setLatestTranscript] = useState<string>("");

  const checkBackendHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/health");
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      setHealthStatus(null);
    } finally {
      setLoading(false);
    }
  };
  const handleAudioData = async (audioBlob: Blob) => {
    console.log("🎙️ Processing audio chunk:", audioBlob.size, "bytes");

    try {
      // Enviar para backend para análise DISC
      const formData = new FormData();
      formData.append("audio", audioBlob, `chunk-${Date.now()}.wav`);
      formData.append("sessionId", "current-session");

      const response = await fetch("http://localhost:3001/api/audio/process", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("🧠 Analysis result:", result);

      // Extract data from response
      if (result.success && result.data) {
        const segment = result.data;

        // Update latest transcript
        if (segment.transcript) {
          setLatestTranscript(segment.transcript);
        }

        // Note: Profile data will come from backend logs for now
        // In a future version, we'll extract it from the API response
      }
    } catch (error) {
      console.error("❌ Failed to process audio:", error);
    }
  };

  const handleAudioError = (error: string) => {
    console.error("🚨 Audio error:", error);
  };

  const handleTranscriptionResult = (result: TranscriptionResult) => {
    console.log("📝 Transcription result:", result);
    setLatestTranscript(result.transcript);
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Temporary function to simulate profile detection
  // In real implementation, this would come from backend API response
  const simulateProfileDetection = (transcript: string): DiscProfile | null => {
    if (transcript.length < 10) return null;

    const lowerTranscript = transcript.toLowerCase();

    // Simple heuristics to demonstrate
    if (
      lowerTranscript.includes("dados") ||
      lowerTranscript.includes("analisar")
    ) {
      return {
        assertiveness: -30,
        emotionality: -40,
        profile: "ANALITICO",
        confidence: 85,
      };
    }

    if (
      lowerTranscript.includes("equipe") ||
      lowerTranscript.includes("discutir")
    ) {
      return {
        assertiveness: -20,
        emotionality: 30,
        profile: "INTEGRADOR",
        confidence: 80,
      };
    }

    if (
      lowerTranscript.includes("resultado") ||
      lowerTranscript.includes("quanto")
    ) {
      return {
        assertiveness: 50,
        emotionality: -30,
        profile: "PRAGMATICO",
        confidence: 75,
      };
    }

    if (
      lowerTranscript.includes("incrível") ||
      lowerTranscript.includes("futuro")
    ) {
      return {
        assertiveness: 40,
        emotionality: 60,
        profile: "INTUITIVO",
        confidence: 82,
      };
    }

    return null;
  };

  // Update profile when transcript changes
  React.useEffect(() => {
    if (latestTranscript) {
      const detectedProfile = simulateProfileDetection(latestTranscript);
      if (detectedProfile) {
        setCurrentProfile(detectedProfile);
        console.log("🧠 Profile detected:", detectedProfile);
      }
    }
  }, [latestTranscript]);

  return (
    <>
      {/* Container principal da aplicação. Removi a classe 'dark' e 'border rounded-lg' daqui,
          pois geralmente o tema escuro é controlado por um provedor de tema, e bordas
          arredondadas são mais comuns em componentes internos, não na tela inteira. */}
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho da aplicação */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">🧠 Sales Co-pilot</h1>
            <p className="text-xl text-muted-foreground">
              AI-powered sales assistant with real-time DISC behavioral analysis
            </p>
          </div>

          {/* Layout de grid principal para as seções da aplicação */}
          {/* Aumentado o gap vertical (gap-y-8) para mais espaçamento entre as linhas de cards.
              Mantido gap-x-6 para espaçamento horizontal. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8">
            {/* Coluna 1: Gravador de Áudio e Status da Gravação */}
            {/* space-y-6 fornece espaçamento vertical entre os filhos desta coluna */}
            <div className="space-y-6">
              <AudioRecorder
                onAudioData={handleAudioData}
                onError={handleAudioError}
              />

              {/* Card de Status da Gravação: Alterado p-4 para p-6 para padding consistente */}
              <Card className="p-6">
                <div className="text-center">
                  {/* Variantes de Badge ajustadas para usar as cores do tema */}
                  <Badge variant={isRecording ? "default" : "outline"}>
                    {isRecording ? "🎙️ Session Active" : "⏹️ Session Inactive"}
                  </Badge>
                </div>
              </Card>
            </div>

            {/* Coluna 2: Transcrição ao Vivo */}
            {/* Assumindo que LiveTranscription renderiza um Card internamente com seu próprio padding */}
            <div className="lg:col-span-1">
              <LiveTranscription
                isRecording={isRecording}
                onTranscriptionResult={handleTranscriptionResult}
              />
            </div>

            {/* Coluna 3: Recomendações ao Vivo - NOVO */}
            {/* Assumindo que LiveRecommendations renderiza um Card internamente com seu próprio padding */}
            <div className="lg:col-span-1">
              <LiveRecommendations
                currentProfile={currentProfile}
                latestTranscript={latestTranscript}
                isRecording={isRecording}
              />
            </div>

            {/* Coluna 4: Status do Sistema e Progresso */}
            {/* space-y-6 fornece espaçamento vertical entre os filhos desta coluna */}
            <div className="space-y-6">
              {/* Card de Status do Backend: Adicionado p-6 para padding consistente do card */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    ⚙️ Backend Status
                    {healthStatus?.success ? (
                      <Badge className="bg-primary text-primary-foreground">
                        Online
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Offline</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Connection to Sales Co-pilot API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthStatus ? (
                    <div className="space-y-2">
                      <p className="text-sm text-foreground">
                        <strong>Environment:</strong> {healthStatus.environment}
                      </p>
                      <p className="text-sm text-foreground">
                        <strong>Uptime:</strong>{" "}
                        {Math.floor(healthStatus.uptime)}s
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last check:{" "}
                        {new Date(healthStatus.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-destructive">
                      Failed to connect to backend
                    </p>
                  )}

                  <Button
                    onClick={checkBackendHealth}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "🔄 Checking..." : "🔄 Refresh Status"}
                  </Button>
                </CardContent>
              </Card>

              {/* Card de Progresso do Desenvolvimento: Adicionado p-6 para padding consistente do card */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    🚀 Development Progress
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Current implementation status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        ✅ Done
                      </Badge>
                      <span className="text-sm text-foreground">
                        Audio recording system
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        ✅ Done
                      </Badge>
                      <span className="text-sm text-foreground">
                        GPT-4 DISC analysis
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        ✅ Done
                      </Badge>
                      <span className="text-sm text-foreground">
                        Intelligent recommendations
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-accent text-accent-foreground">
                        🔄 Now
                      </Badge>
                      <span className="text-sm text-foreground">
                        Live recommendations UI
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Rodapé da aplicação */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              🎯 Audio + Transcription System Ready - Test by speaking while
              recording!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
