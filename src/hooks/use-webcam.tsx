import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

export interface WebcamConstraints {
  video?: {
    width?: number;
    height?: number;
    facingMode?: "user" | "environment";
    frameRate?: number;
  };
  audio?: boolean;
}

export interface WebcamState {
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  hasPermission: boolean;
  currentDeviceId: string | null;
}

export interface UseWebcamOptions {
  deviceId?: string;
  constraints?: WebcamConstraints;
  autoStart?: boolean;
  onError?: (error: string) => void;
  onStreamChange?: (stream: MediaStream | null) => void;
}

const DEFAULT_CONSTRAINTS: WebcamConstraints = {
  video: {
    width: 1280,
    height: 720,
    facingMode: "environment",
    frameRate: 30,
  },
  audio: false,
};

/**
 * Hook for managing webcam functionality with a specific device ID
 * @param options Configuration options including deviceId, constraints, and callbacks
 * @returns Webcam state, actions, and utilities
 */
export const useWebcam = (options: UseWebcamOptions = {}) => {
  const {
    deviceId,
    constraints = DEFAULT_CONSTRAINTS,
    autoStart = false,
    onError,
    onStreamChange,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<WebcamState>({
    stream: null,
    isActive: false,
    error: null,
    hasPermission: false,
    currentDeviceId: null,
  });

  // Mutation to start webcam
  const startWebcamMutation = useMutation({
    mutationKey: ["webcam", "start", deviceId],
    mutationFn: async (overrideDeviceId?: string | null) => {
      try {
        // Stop existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const targetDeviceId = overrideDeviceId || deviceId;
        const videoConstraints = {
          ...constraints.video,
          ...(targetDeviceId && { deviceId: { exact: targetDeviceId } }),
        };

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: constraints.audio,
        });

        streamRef.current = stream;

        // Update video element if ref is available
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setState((prev) => ({
          ...prev,
          stream,
          isActive: true,
          error: null,
          hasPermission: true,
          currentDeviceId: targetDeviceId || null,
        }));

        onStreamChange?.(stream);
        return stream;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isActive: false,
          hasPermission: false,
        }));
        onError?.(errorMessage);
        throw error;
      }
    },
  });

  // Mutation to stop webcam
  const stopWebcamMutation = useMutation({
    mutationKey: ["webcam", "stop"],
    mutationFn: async () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setState((prev) => ({
        ...prev,
        stream: null,
        isActive: false,
        currentDeviceId: null,
      }));

      onStreamChange?.(null);
    },
  });

  // Mutation to capture photo
  const capturePhotoMutation = useMutation({
    mutationKey: ["webcam", "capture"],
    mutationFn: async (): Promise<string> => {
      if (!videoRef.current || !state.isActive) {
        throw new Error("Webcam is not active");
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Failed to get canvas context");
      }

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0);

      return canvas.toDataURL("image/jpeg", 0.8);
    },
  });

  // Auto-start effect
  useEffect(() => {
    if (autoStart && !state.isActive && !state.error && deviceId) {
      startWebcamMutation.mutate(null);
    }
  }, [autoStart, state.isActive, state.error, deviceId, startWebcamMutation]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const start = useCallback(
    (overrideDeviceId?: string) => {
      const targetDeviceId = overrideDeviceId || deviceId;
      if (!targetDeviceId) {
        const errorMessage = "No device ID provided";
        setState((prev) => ({ ...prev, error: errorMessage }));
        onError?.(errorMessage);
        return;
      }
      startWebcamMutation.mutate(targetDeviceId);
    },
    [deviceId, startWebcamMutation, onError]
  );

  const stop = useCallback(() => {
    stopWebcamMutation.mutate();
  }, [stopWebcamMutation]);

  const capturePhoto = useCallback(() => {
    return capturePhotoMutation.mutateAsync();
  }, [capturePhotoMutation]);

  return {
    // State
    ...state,
    videoRef,

    // Actions
    start,
    stop,
    capturePhoto,

    // Mutation states
    isStarting: startWebcamMutation.isPending,
    isStopping: stopWebcamMutation.isPending,
    isCapturing: capturePhotoMutation.isPending,

    // Errors
    startError: startWebcamMutation.error,
    stopError: stopWebcamMutation.error,
    captureError: capturePhotoMutation.error,

    // Utilities
    canCapture: state.isActive && !capturePhotoMutation.isPending,
  };
};

// Helper function to get user-friendly error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    switch (error.name) {
      case "NotAllowedError":
        return "Camera access denied. Please allow camera permissions.";
      case "NotFoundError":
        return "No camera found. Please connect a camera device.";
      case "NotReadableError":
        return "Camera is already in use by another application.";
      case "OverconstrainedError":
        return "Camera constraints cannot be satisfied.";
      case "SecurityError":
        return "Camera access blocked due to security restrictions.";
      case "TypeError":
        return "Invalid camera constraints provided.";
      default:
        return error.message || "An unknown error occurred.";
    }
  }
  return "An unknown error occurred.";
}

// Export types for external use
export type {
  WebcamConstraints as UseWebcamConstraints,
  UseWebcamOptions as UseWebcamOptionsType,
  WebcamState as UseWebcamState,
};
