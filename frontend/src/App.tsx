import React, { useState, useEffect } from "react";
import AudioRecorder from "@/components/features/audio/AudioRecorder";
import LiveRecommendations from "@/components/features/audio/LiveRecommendations";
import { DiscProfile, TranscriptionResult } from "@/types";
import ExpandedProfileDisplay from "@/components/features/audio/ExpandedProfileDisplay";
import { apiService } from "@/services/api";
import {
  ExpandedDISCProfile,
  MBTIProfile,
  BehavioralAnalysisResponse,
} from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [expandedDiscProfile, setExpandedDiscProfile] =
    useState<ExpandedDISCProfile | null>(null);
  const [mbtiProfile, setMBTIProfile] = useState<MBTIProfile | null>(null);
  const [behavioralAnalysis, setBehavioralAnalysis] =
    useState<BehavioralAnalysisResponse | null>(null);

  const [showExpandedAnalysis, setShowExpandedAnalysis] = useState(false);

  const checkBackendHealth = async () => {
    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${API_URL.replace("/api", "")}/api/health`);
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

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(
        `${API_URL.replace("/api", "")}/api/audio/process`,
        {
          method: "POST",
          body: formData,
        }
      );

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

  const handleRealTimeAnalysis = async (transcript: string) => {
    if (transcript.length < 10) return;

    try {
      console.log("🧠 [STAGING] Real-time behavioral analysis...");

      const result = await apiService.processExpandedBehavioral(transcript);

      if (result.success) {
        // Atualizar perfil atual (compatibilidade com sistema atual)
        const basicProfile = {
          assertiveness: result.data.profiles.disc.behavioralAxes.attackDefense,
          emotionality: result.data.profiles.disc.behavioralAxes.reasonEmotion,
          profile: result.data.profiles.disc.type,
          confidence: result.data.profiles.disc.confidence,
        };
        setCurrentProfile(basicProfile);

        // Atualizar análises expandidas automaticamente
        setBehavioralAnalysis(result.data);
        setExpandedDiscProfile(result.data.profiles.disc);
        setMBTIProfile(result.data.profiles.mbti);
        setShowExpandedAnalysis(true);

        console.log("✅ [STAGING] Real-time analysis completed");
      }
    } catch (error) {
      console.error("❌ [STAGING] Real-time analysis error:", error);
      // Fallback para simulação se API falhar
      const fallbackProfile = simulateProfileDetection(transcript);
      if (fallbackProfile) setCurrentProfile(fallbackProfile);
    }
  };

  const handleExpandedAnalysis = async () => {
    if (!latestTranscript || latestTranscript.length < 10) {
      console.log("❌ Transcript too short for expanded analysis");
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log("🧠 [STAGING] Starting expanded behavioral analysis...");

      const result =
        await apiService.processExpandedBehavioral(latestTranscript);

      if (result.success) {
        setBehavioralAnalysis(result.data);
        setExpandedDiscProfile(result.data.profiles.disc);
        setMBTIProfile(result.data.profiles.mbti);
        setShowExpandedAnalysis(true);
        console.log("✅ [STAGING] Expanded analysis completed:", result.data);
      } else {
        console.error("❌ [STAGING] Expanded analysis failed");
      }
    } catch (error) {
      console.error("❌ [STAGING] Error in expanded analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  React.useEffect(() => {
    if (!latestTranscript) return;

    // Debounce para evitar múltiplas chamadas
    const timeoutId = setTimeout(() => {
      handleRealTimeAnalysis(latestTranscript);
    }, 1000); // Aguarda 1 segundo após última mudança

    return () => clearTimeout(timeoutId);
  }, [latestTranscript]);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container px-6 py-12 mx-auto">
        {/* Beautiful Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 rounded-full shadow-2xl bg-gradient-to-br from-green-500 to-blue-600">
                <span className="text-4xl">🧠</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-blue-600 blur-xl opacity-30"></div>
            </div>
            <div className="text-left">
              <h1 className="mb-3 text-6xl font-bold text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text">
                Sales Co-pilot
              </h1>
              <p className="text-xl font-semibold text-green-700">
                AI-Powered Sales Intelligence Platform
              </p>
            </div>
          </div>

          <p className="max-w-4xl mx-auto mb-10 text-xl leading-relaxed text-gray-700">
            Análise comportamental DISC em tempo real com recomendações
            inteligentes para{" "}
            <span className="font-bold text-green-600">
              maximizar suas conversões
            </span>
            através de inteligência artificial avançada
          </p>

          {/* Status Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-3 px-6 py-3 bg-green-100 border border-green-200 rounded-full shadow-lg">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-800">
                Sistema Ativo
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-blue-100 border border-blue-200 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-blue-800">
                GPT-4 + Whisper AI
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-purple-100 border border-purple-200 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-purple-800">
                Real-time Analysis
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid with Beautiful Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Audio Recorder Card */}
          <div className="p-8 transition-all duration-300 border border-gray-100 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl hover:shadow-3xl hover:-translate-y-2">
            <AudioRecorder
              onAudioData={handleAudioData}
              onError={handleAudioError}
            />
          </div>

          {/* Live Transcription Card
          <div className="p-8 transition-all duration-300 border border-gray-100 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl hover:shadow-3xl hover:-translate-y-2">
            <LiveTranscription
              isRecording={isRecording}
              onTranscriptionResult={handleTranscriptionResult}
            />
          </div> */}

          {/* Live Recommendations Card */}
          <div className="p-8 transition-all duration-300 border border-gray-100 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl hover:shadow-3xl hover:-translate-y-2">
            <LiveRecommendations
              currentProfile={currentProfile}
              latestTranscript={latestTranscript}
              isRecording={isRecording}
            />
          </div>

          {/* System Status Card */}
          <div className="p-8 transition-all duration-300 border border-gray-100 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl hover:shadow-3xl hover:-translate-y-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200">
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
              <div className="flex items-center justify-between p-4 border border-green-200 rounded-xl bg-green-50">
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

              <div className="flex items-center justify-between p-4 border border-blue-200 rounded-xl bg-blue-50">
                <span className="text-sm font-semibold text-gray-800">
                  Environment
                </span>
                <span className="text-sm font-medium text-blue-700">
                  {healthStatus?.environment || "Development"}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 border border-purple-200 rounded-xl bg-purple-50">
                <span className="text-sm font-semibold text-gray-800">
                  Uptime
                </span>
                <span className="font-mono text-sm text-purple-700">
                  {healthStatus ? Math.floor(healthStatus.uptime) : 0}s
                </span>
              </div>

              <button
                onClick={checkBackendHealth}
                disabled={loading}
                className="w-full px-6 py-3 font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 rounded-full border-white/20 border-t-white animate-spin"></div>
                    Checking...
                  </div>
                ) : (
                  "🔄 Refresh Status"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================
            🧠 ANÁLISE COMPORTAMENTAL EXPANDIDA AUTOMÁTICA
            ======================================== */}

        {/* Expanded Analysis Results - Automática */}
        {showExpandedAnalysis && behavioralAnalysis && (
          <div className="mt-16">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Análise Comportamental Detalhada
              </h2>
              <p className="max-w-3xl mx-auto mb-4 text-xl text-gray-700">
                Análise automática em tempo real com{" "}
                <span className="font-bold text-blue-600">DISC + FDNA</span> e{" "}
                <span className="font-bold text-purple-600">MBTI</span>
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">
                  Análise ativa em tempo real
                </span>
              </div>
            </div>

            <div className="p-8 border border-gray-100 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl">
              <Tabs
                defaultValue="profiles"
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="profiles">
                    📊 Perfis Detalhados
                  </TabsTrigger>
                  <TabsTrigger value="recommendations">
                    💡 Recomendações
                  </TabsTrigger>
                  <TabsTrigger value="insights">
                    🎯 Insights Combinados
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="profiles"
                  className="mt-6"
                >
                  <ExpandedProfileDisplay
                    discProfile={expandedDiscProfile}
                    mbtiProfile={mbtiProfile}
                    isLoading={false}
                  />
                </TabsContent>

                <TabsContent
                  value="recommendations"
                  className="mt-6"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Estratégia DISC */}
                    <div className="p-6 border border-blue-200 bg-blue-50 rounded-xl">
                      <h3 className="flex items-center gap-2 mb-3 font-bold text-blue-800">
                        <span>🎯</span>
                        Estratégia DISC
                      </h3>
                      <p className="text-blue-700">
                        {behavioralAnalysis.recommendations.discBasedStrategy}
                      </p>
                    </div>

                    {/* Abordagem MBTI */}
                    <div className="p-6 border border-purple-200 bg-purple-50 rounded-xl">
                      <h3 className="flex items-center gap-2 mb-3 font-bold text-purple-800">
                        <span>🧩</span>
                        Abordagem MBTI
                      </h3>
                      <p className="text-purple-700">
                        {behavioralAnalysis.recommendations.mbtiBasedApproach}
                      </p>
                    </div>
                  </div>

                  {/* Script Sugerido */}
                  <div className="p-6 mt-6 border border-green-200 bg-green-50 rounded-xl">
                    <h3 className="flex items-center gap-2 mb-3 font-bold text-green-800">
                      <span>💬</span>
                      Script Sugerido
                    </h3>
                    <p className="italic text-green-700">
                      "{behavioralAnalysis.recommendations.script}"
                    </p>
                  </div>
                </TabsContent>

                <TabsContent
                  value="insights"
                  className="mt-6"
                >
                  <div className="p-6 border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <h3 className="flex items-center gap-2 mb-4 font-bold text-gray-800">
                      <span>🎯</span>
                      Insights Comportamentais Combinados
                    </h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      {behavioralAnalysis.recommendations.combinedInsights}
                    </p>

                    <div className="p-4 mt-4 rounded-lg bg-white/70">
                      <p className="text-sm text-gray-600">
                        <strong>Ação Imediata:</strong>{" "}
                        {behavioralAnalysis.recommendations.immediateAction}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 border border-green-200 rounded-full shadow-lg bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 backdrop-blur-sm">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse"></div>
            <span className="text-sm font-bold text-transparent bg-gradient-to-r from-green-700 to-purple-700 bg-clip-text">
              Sistema Completo • Interface Modernizada • Ready for Production
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
