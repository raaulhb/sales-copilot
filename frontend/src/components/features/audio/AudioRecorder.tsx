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
        <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
          🔴 Recording
        </Badge>
      );
    }
    if (isRecording && isPaused) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          ⏸️ Paused
        </Badge>
      );
    }
    if (audioBlob) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          ✅ Ready
        </Badge>
      );
    }
    return <Badge variant="outline">⏹️ Stopped</Badge>;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
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

      <CardContent className="space-y-4">
        {/* Duration Display */}
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-slate-900">
            {formatDuration(duration)}
          </div>
          <p className="text-sm text-slate-500">Recording time</p>
        </div>

        {/* Visual Indicator */}
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
              isRecording && !isPaused
                ? "border-red-500 bg-red-50 animate-pulse"
                : isPaused
                  ? "border-yellow-500 bg-yellow-50"
                  : audioBlob
                    ? "border-green-500 bg-green-50"
                    : "border-slate-300 bg-slate-50"
            }`}
          >
            {isRecording && !isPaused ? (
              <Mic className="h-8 w-8 text-red-600" />
            ) : isPaused ? (
              <Pause className="h-8 w-8 text-yellow-600" />
            ) : audioBlob ? (
              <Square className="h-8 w-8 text-green-600" />
            ) : (
              <MicOff className="h-8 w-8 text-slate-400" />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={resumeRecording}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}

              <Button
                onClick={stopRecording}
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}

          {(audioBlob || isRecording) && (
            <Button
              onClick={resetRecording}
              variant="outline"
              size="icon"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* Audio Info & Playback */}
        {audioBlob && (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-2">
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
              variant="outline"
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
