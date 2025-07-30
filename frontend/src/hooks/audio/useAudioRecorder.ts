import { useState, useRef, useCallback } from "react";
import RecordRTC from "recordrtc";

interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  error: string | null;
}

interface AudioRecorderOptions {
  sampleRate?: number;
  channels?: number;
  onDataAvailable?: (audioData: Blob) => void;
  onError?: (error: string) => void;
}

export const useAudioRecorder = (options: AudioRecorderOptions = {}) => {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    error: null,
  });

  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: options.sampleRate || 44100,
          channelCount: options.channels || 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Initialize RecordRTC
      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: options.channels || 1,
        desiredSampRate: options.sampleRate || 44100,
        timeSlice: 3000, // Get data every second
        ondataavailable: (blob: Blob) => {
          if (options.onDataAvailable) {
            options.onDataAvailable(blob);
          }
        },
      });

      recorderRef.current = recorder;
      recorder.startRecording();

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
      }));

      console.log("🎙️ Audio recording started");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start recording";
      setState((prev) => ({ ...prev, error: errorMessage }));
      options.onError?.(errorMessage);
      console.error("Recording error:", error);
    }
  }, [options]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && state.isRecording) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        setState((prev) => ({
          ...prev,
          isRecording: false,
          audioBlob: blob || null, // Este é o áudio COMPLETO para playback
        }));

        // Clean up
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        console.log(
          "🎙️ Audio recording stopped - Full recording available for playback"
        );
      });
    }
  }, [state.isRecording, options]);

  const pauseRecording = useCallback(() => {
    if (recorderRef.current && state.isRecording && !state.isPaused) {
      recorderRef.current.pauseRecording();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setState((prev) => ({ ...prev, isPaused: true }));
      console.log("⏸️ Audio recording paused");
    }
  }, [state.isRecording, state.isPaused]);

  const resumeRecording = useCallback(() => {
    if (recorderRef.current && state.isRecording && state.isPaused) {
      recorderRef.current.resumeRecording();
      intervalRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      setState((prev) => ({ ...prev, isPaused: false }));
      console.log("▶️ Audio recording resumed");
    }
  }, [state.isRecording, state.isPaused]);

  const resetRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      error: null,
    });

    recorderRef.current = null;
    streamRef.current = null;
    console.log("🔄 Audio recording reset");
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  };
};
