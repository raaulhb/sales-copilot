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
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  RotateCcw,
  Download,
} from "lucide-react";
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
        <Badge className="bg-red-500 text-white animate-pulse shadow-lg">
          🔴 Recording
        </Badge>
      );
    }
    if (isRecording && isPaused) {
      return <Badge className="bg-yellow-500 text-white">⏸️ Paused</Badge>;
    }
    if (audioBlob) {
      return (
        <Badge className="bg-primary text-primary-foreground shadow-md">
          ✅ Ready
        </Badge>
      );
    }
    return <Badge variant="outline">⏹️ Stopped</Badge>;
  };

  return (
    <Card className="w-full card-hover border-primary/10 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mic className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Audio Recorder</CardTitle>
              <CardDescription className="text-sm">
                Record para análise em tempo real
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Duration Display */}
        <div className="text-center py-4">
          <div className="text-4xl font-mono font-bold text-foreground mb-2">
            {formatDuration(duration)}
          </div>
          <p className="text-sm text-muted-foreground">Recording time</p>
        </div>

        {/* Visual Indicator */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
              isRecording && !isPaused
                ? "border-red-500/50 bg-red-500/10 animate-pulse shadow-lg"
                : isPaused
                  ? "border-yellow-500/50 bg-yellow-500/10 shadow-md"
                  : audioBlob
                    ? "border-primary/50 bg-primary/10 shadow-md"
                    : "border bg-background"
            }`}
          >
            {isRecording && !isPaused ? (
              <Mic className="h-10 w-10 text-red-500" />
            ) : isPaused ? (
              <Pause className="h-10 w-10 text-yellow-600" />
            ) : audioBlob ? (
              <Square className="h-10 w-10 text-primary" />
            ) : (
              <MicOff className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </Button>
          ) : (
            <div className="flex gap-2">
              {!isPaused ? (
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  className="flex-1 h-12"
                  size="lg"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={resumeRecording}
                  className="flex-1 h-12"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}

              <Button
                onClick={stopRecording}
                variant="destructive"
                className="flex-1 h-12"
                size="lg"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>

              <Button
                onClick={resetRecording}
                variant="outline"
                size="lg"
                className="h-12 px-4"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Audio Info & Playback */}
        {audioBlob && (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium mb-3">
                ✅ Audio recorded successfully (
                {Math.round(audioBlob.size / 1024)}KB)
              </p>

              {/* Audio Player */}
              <audio
                controls
                className="w-full mb-3"
                src={URL.createObjectURL(audioBlob)}
              >
                Your browser does not support the audio element.
              </audio>

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
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Recording
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioRecorder;
