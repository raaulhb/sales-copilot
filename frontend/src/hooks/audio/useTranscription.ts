import { useState, useCallback } from "react";
import {
  speechToTextService,
  TranscriptionResult,
} from "@/services/audio/speechToText";

interface TranscriptionState {
  isTranscribing: boolean;
  currentTranscript: string;
  transcripts: TranscriptionResult[];
  error: string | null;
  isSupported: boolean;
}

export const useTranscription = () => {
  const [state, setState] = useState<TranscriptionState>({
    isTranscribing: false,
    currentTranscript: "",
    transcripts: [],
    error: null,
    isSupported: speechToTextService.isSupported(),
  });

  const startTranscription = useCallback(async () => {
    if (!speechToTextService.isSupported()) {
      setState((prev) => ({
        ...prev,
        error: "Speech recognition not supported in this browser",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isTranscribing: true,
      error: null,
      currentTranscript: "",
    }));

    await speechToTextService.startTranscription(
      {
        continuous: true,
        interimResults: true,
        language: "pt-BR",
      },
      (result: TranscriptionResult) => {
        setState((prev) => ({
          ...prev,
          currentTranscript: result.transcript,
          transcripts: [...prev.transcripts, result],
        }));
      },
      (error: string) => {
        setState((prev) => ({
          ...prev,
          error,
          isTranscribing: false,
        }));
      }
    );
  }, []);

  const stopTranscription = useCallback(() => {
    speechToTextService.stopTranscription();
    setState((prev) => ({ ...prev, isTranscribing: false }));
  }, []);

  const clearTranscripts = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcripts: [],
      currentTranscript: "",
      error: null,
    }));
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      const result = await speechToTextService.transcribeAudioBlob(audioBlob);

      setState((prev) => ({
        ...prev,
        transcripts: [...prev.transcripts, result],
        currentTranscript: result.transcript,
      }));

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Transcription failed";
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  return {
    ...state,
    startTranscription,
    stopTranscription,
    clearTranscripts,
    transcribeAudio,
  };
};
