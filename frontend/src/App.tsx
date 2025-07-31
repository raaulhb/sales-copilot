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
import "./App.css";

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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🧠 Sales Co-pilot
          </h1>
          <p className="text-xl text-slate-600">
            AI-powered sales assistant with real-time DISC behavioral analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Audio Recorder */}
          <div className="space-y-6">
            <AudioRecorder
              onAudioData={handleAudioData}
              onError={handleAudioError}
            />

            {/* Recording Status */}
            <Card className="p-4">
              <div className="text-center">
                <Badge variant={isRecording ? "default" : "outline"}>
                  {isRecording ? "🎙️ Session Active" : "⏹️ Session Inactive"}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Live Transcription */}
          <div className="lg:col-span-1">
            <LiveTranscription
              isRecording={isRecording}
              onTranscriptionResult={handleTranscriptionResult}
            />
          </div>

          {/* Live Recommendations - NOVO */}
          <div className="lg:col-span-1">
            <LiveRecommendations
              currentProfile={currentProfile}
              latestTranscript={latestTranscript}
              isRecording={isRecording}
            />
          </div>

          {/* System Status & Progress */}
          <div className="space-y-6">
            {/* Backend Status - mantém o código existente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚙️ Backend Status
                  {healthStatus?.success ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Online
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Offline</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Connection to Sales Co-pilot API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthStatus ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Environment:</strong> {healthStatus.environment}
                    </p>
                    <p className="text-sm">
                      <strong>Uptime:</strong> {Math.floor(healthStatus.uptime)}
                      s
                    </p>
                    <p className="text-sm text-slate-500">
                      Last check:{" "}
                      {new Date(healthStatus.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-red-600">
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

            {/* Development Progress */}
            <Card>
              <CardHeader>
                <CardTitle>🚀 Development Progress</CardTitle>
                <CardDescription>Current implementation status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      ✅ Done
                    </Badge>
                    <span className="text-sm">Audio recording system</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      ✅ Done
                    </Badge>
                    <span className="text-sm">GPT-4 DISC analysis</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      ✅ Done
                    </Badge>
                    <span className="text-sm">Intelligent recommendations</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      🔄 Now
                    </Badge>
                    <span className="text-sm">Live recommendations UI</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            🎯 Audio + Transcription System Ready - Test by speaking while
            recording!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
