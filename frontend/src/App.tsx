import { useState, useEffect } from "react";
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
import { TranscriptionResult } from "@/services/audio/speechToText";
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
      formData.append("sessionId", "current-session"); // Implementar session ID depois

      const response = await fetch("http://localhost:3001/api/audio/process", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("🧠 Analysis result:", result);
    } catch (error) {
      console.error("❌ Failed to process audio:", error);
    }
  };

  const handleAudioError = (error: string) => {
    console.error("🚨 Audio error:", error);
  };

  const handleTranscriptionResult = (result: TranscriptionResult) => {
    console.log("📝 Transcription result:", result);
    // Aqui vamos integrar com DISC analysis depois
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Audio Recorder */}
          <div className="space-y-6">
            <AudioRecorder
              onAudioData={handleAudioData}
              onError={handleAudioError}
            />

            {/* We'll track recording state from the recorder */}
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

          {/* System Status & Progress */}
          <div className="space-y-6">
            {/* Backend Status */}
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
                    <span className="text-sm">Live speech-to-text</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      🔄 Next
                    </Badge>
                    <span className="text-sm">DISC analysis integration</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">⏳ Todo</Badge>
                    <span className="text-sm">Real-time recommendations</span>
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
