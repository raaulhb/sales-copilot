import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";
import { useTranscription } from "@/hooks/audio/useTranscription";
import { TranscriptionResult } from "@/services/audio/speechToText";

interface LiveTranscriptionProps {
  isRecording: boolean;
  onTranscriptionResult?: (result: TranscriptionResult) => void;
}

const LiveTranscription: React.FC<LiveTranscriptionProps> = ({
  isRecording,
  onTranscriptionResult,
}) => {
  const {
    isTranscribing,
    currentTranscript,
    transcripts,
    error,
    isSupported,
    startTranscription,
    stopTranscription,
    clearTranscripts,
  } = useTranscription();

  // Auto start/stop transcription based on recording state
  React.useEffect(() => {
    if (isRecording && !isTranscribing && isSupported) {
      startTranscription();
    } else if (!isRecording && isTranscribing) {
      stopTranscription();
    }
  }, [
    isRecording,
    isTranscribing,
    isSupported,
    startTranscription,
    stopTranscription,
  ]);

  // Notify parent of new transcription results
  React.useEffect(() => {
    if (transcripts.length > 0 && onTranscriptionResult) {
      const latestTranscript = transcripts[transcripts.length - 1];
      onTranscriptionResult(latestTranscript);
    }
  }, [transcripts, onTranscriptionResult]);

  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Live Transcription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Speech recognition not supported in this browser
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Live Transcription
          </CardTitle>
          <div className="flex items-center gap-2">
            {isTranscribing ? (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 animate-pulse">
                🎤 Listening
              </Badge>
            ) : (
              <Badge variant="outline">⏹️ Stopped</Badge>
            )}
            {transcripts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearTranscripts}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription>Real-time speech-to-text conversion</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* Current Transcript (Live) */}
        {currentTranscript && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-1">
              🎤 Live Transcript:
            </p>
            <p className="text-sm text-blue-800">{currentTranscript}</p>
          </div>
        )}

        {/* Transcript History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700">
              Transcript History
            </h4>
            <Badge
              variant="outline"
              className="text-xs"
            >
              {transcripts.length} segments
            </Badge>
          </div>

          {transcripts.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start recording to see transcripts here</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {transcripts.slice(-10).map((transcript, index) => (
                <div
                  key={index}
                  className="p-2 bg-slate-50 border border-slate-200 rounded text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">
                      {new Date(transcript.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      {Math.round(transcript.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-slate-700">{transcript.transcript}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {transcripts.length > 0 && (
          <div className="text-xs text-slate-500 text-center pt-2 border-t">
            Total words:{" "}
            {transcripts.reduce(
              (total, t) => total + t.transcript.split(" ").length,
              0
            )}{" "}
            | Avg confidence:{" "}
            {Math.round(
              (transcripts.reduce((total, t) => total + t.confidence, 0) /
                transcripts.length) *
                100
            )}
            %
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveTranscription;
