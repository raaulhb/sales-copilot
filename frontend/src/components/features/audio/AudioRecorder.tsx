import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Play, Pause, Square, RotateCcw } from "lucide-react";
import { useAudioRecorder } from "@/hooks/audio/useAudioRecorder";

interface AudioRecorderProps {
  onAudioData?: (audioBlob: Blob) => void;
  onError?: (error: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioData,
  onError,
}) => {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder({
    onDataAvailable: onAudioData,
    onError: onError,
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getStatusBadge = () => {
    if (isRecording && !isPaused) {
      return (
        <Badge
          variant="destructive"
          className="animate-pulse"
        >
          🔴 Recording
        </Badge>
      );
    }
    if (isRecording && isPaused) {
      return <Badge variant="secondary">⏸️ Paused</Badge>;
    }
    if (audioBlob) {
      return <Badge variant="default">✅ Ready</Badge>;
    }
    return <Badge variant="outline">⏹️ Stopped</Badge>;
  };

  return (
    <Card className="w-1/4 max-w-md mb-8">
      <CardHeader>
        <div className="flex items-center justify-between mb-8">
          {" "}
          {/* Adicionado mb-2 para espaçamento */}
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Audio Recorder
          </CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Record your conversation for real-time analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {" "}
        {/* Aumentado para space-y-6 para mais espaçamento entre blocos */}
        {/* Duration Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-foreground">
            {" "}
            {/* text-foreground para cor do tema */}
            {formatDuration(duration)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Recording time</p>{" "}
          {/* text-muted-foreground para cor secundária */}
        </div>
        {/* Visual Indicator */}
        <div className="flex justify-center mb-4">
          {" "}
          {/* Adicionado mb-4 para espaçamento */}
          <div
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
              isRecording && !isPaused
                ? "border-destructive/50 bg-destructive/10 animate-pulse" // Cores do tema para gravação
                : isPaused
                  ? "border-secondary/50 bg-secondary/10" // Cores do tema para pausado
                  : audioBlob
                    ? "border-primary/50 bg-primary/10" // Cores do tema para pronto
                    : "border-border bg-background" // Cores do tema para parado
            }`}
          >
            {isRecording && !isPaused ? (
              <Mic className="h-8 w-8 text-destructive" /> // Cores do tema para ícone
            ) : isPaused ? (
              <Pause className="h-8 w-8 text-secondary-foreground" /> // Cores do tema para ícone
            ) : audioBlob ? (
              <Square className="h-8 w-8 text-primary" /> // Cores do tema para ícone
            ) : (
              <MicOff className="h-8 w-8 text-muted-foreground" /> // Cores do tema para ícone
            )}
          </div>
        </div>
        {/* Controls */}
        <div className="flex justify-center gap-2 mb-4">
          {" "}
          {/* Adicionado mb-4 para espaçamento */}
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="w-full"
            >
              {" "}
              {/* Botão padrão usa cor primary do tema */}
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <div className="flex flex-grow gap-2">
              {" "}
              {/* flex-grow para ocupar espaço */}
              {!isPaused ? (
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={resumeRecording}
                  className="flex-1"
                >
                  {" "}
                  {/* Botão padrão usa cor primary do tema */}
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
              <Button
                onClick={resetRecording}
                variant="outline"
                size="icon"
                className="flex-shrink-0" // Garante que o botão de reset não encolha
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="flex-1 mb-8"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
          )}
        </div>
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
            {" "}
            {/* Cores do tema para erro, adicionado mb-4 */}
            <p className="text-sm text-destructive">⚠️ {error}</p>
          </div>
        )}
        {/* Audio Info & Playback */}
        {audioBlob && (
          <div className="space-y-3">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              {" "}
              {/* Cores do tema para sucesso */}
              <p className="text-sm text-primary mb-2">
                ✅ Audio recorded successfully (
                {Math.round(audioBlob.size / 1024)}KB)
              </p>
              {/* Audio Player */}
              <audio
                controls
                className="w-full"
                src={URL.createObjectURL(audioBlob)}
              >
                Your browser does not support the audio element.
              </audio>
            </div>

            {/* Download Button */}
            <Button
              onClick={() => {
                const url = URL.createObjectURL(audioBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `recording-${Date.now()}.wav`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              variant="secondary" // Usando variant="secondary" para um visual mais limpo
              className="w-full"
            >
              💾 Download Recording
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioRecorder;
