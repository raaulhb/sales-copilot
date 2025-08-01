import React, { useState, useEffect } from "react";
import AudioRecorder from "@/components/features/audio/AudioRecorder";
import LiveTranscription from "@/components/features/audio/LiveTranscription";
import LiveRecommendations from "@/components/features/audio/LiveRecommendations";
import { DiscProfile, TranscriptionResult } from "@/types";

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
  const [latestTranscript, setLatestTranscript] = useState("");

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
      const formData = new FormData();
      formData.append("audio", audioBlob, `chunk-${Date.now()}.wav`);
      formData.append("sessionId", "current-session");

      const response = await fetch("http://localhost:3001/api/audio/process", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("🧠 Analysis result:", result);

      if (result.success && result.data) {
        const segment = result.data;
        if (segment.transcript) {
          setLatestTranscript(segment.transcript);
        }
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

  const simulateProfileDetection = (transcript: string): DiscProfile | null => {
    if (transcript.length < 10) return null;
    const lowerTranscript = transcript.toLowerCase();

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

  React.useEffect(() => {
    if (latestTranscript) {
      const detectedProfile = simulateProfileDetection(latestTranscript);
      if (detectedProfile) {
        setCurrentProfile(detectedProfile);
        console.log("🧠 Profile detected:", detectedProfile);
      }
    }
  }, [latestTranscript]);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-12">
        {/* Beautiful Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-2xl">
                <span className="text-4xl">🧠</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-blue-600 blur-xl opacity-30"></div>
            </div>
            <div className="text-left">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Sales Co-pilot
              </h1>
              <p className="text-green-700 font-semibold text-xl">
                AI-Powered Sales Intelligence Platform
              </p>
            </div>
          </div>

          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-10 leading-relaxed">
            Análise comportamental DISC em tempo real com recomendações
            inteligentes para{" "}
            <span className="text-green-600 font-bold">
              maximizar suas conversões
            </span>
            através de inteligência artificial avançada
          </p>

          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-green-100 border border-green-200 shadow-lg">
              <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse"></div>
              <span className="text-sm font-bold text-green-800">
                Sistema Ativo
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-blue-100 border border-blue-200 shadow-lg">
              <span className="text-sm font-semibold text-blue-800">
                GPT-4 + Whisper AI
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-purple-100 border border-purple-200 shadow-lg">
              <span className="text-sm font-semibold text-purple-800">
                Real-time Analysis
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid with Beautiful Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Audio Recorder Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl hover:-translate-y-2 transition-all duration-300">
            <AudioRecorder
              onAudioData={handleAudioData}
              onError={handleAudioError}
            />
          </div>

          {/* Live Transcription Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl hover:-translate-y-2 transition-all duration-300">
            <LiveTranscription
              isRecording={isRecording}
              onTranscriptionResult={handleTranscriptionResult}
            />
          </div>

          {/* Live Recommendations Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl hover:-translate-y-2 transition-all duration-300">
            <LiveRecommendations
              currentProfile={currentProfile}
              latestTranscript={latestTranscript}
              isRecording={isRecording}
            />
          </div>

          {/* System Status Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  System Status
                </h3>
                <p className="text-sm text-gray-600">Backend & AI Services</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-xl bg-green-50 border border-green-200">
                <span className="text-sm font-semibold text-gray-800">
                  Backend
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                    healthStatus?.success
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {healthStatus?.success ? "🟢 Online" : "🔴 Offline"}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-sm font-semibold text-gray-800">
                  Environment
                </span>
                <span className="text-sm font-medium text-blue-700">
                  {healthStatus?.environment || "Development"}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-purple-50 border border-purple-200">
                <span className="text-sm font-semibold text-gray-800">
                  Uptime
                </span>
                <span className="text-sm font-mono text-purple-700">
                  {healthStatus ? Math.floor(healthStatus.uptime) : 0}s
                </span>
              </div>

              <button
                onClick={checkBackendHealth}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Checking...
                  </div>
                ) : (
                  "🔄 Refresh Status"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 border border-green-200 shadow-lg backdrop-blur-sm">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse"></div>
            <span className="text-sm font-bold bg-gradient-to-r from-green-700 to-purple-700 bg-clip-text text-transparent">
              Sistema Completo • Interface Modernizada • Ready for Production
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
