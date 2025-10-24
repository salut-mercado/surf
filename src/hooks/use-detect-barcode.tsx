import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export interface DetectedBarcode {
  boundingBox: DOMRectReadOnly;
  rawValue: string;
  format: BarcodeFormat;
  cornerPoints: ReadonlyArray<{ x: number; y: number }>;
}

export interface BarcodeDetectorOptions {
  formats?: BarcodeFormat[];
}

export interface UseDetectBarcodeOptions {
  formats?: BarcodeFormat[];
  enabled?: boolean;
  staleTime?: number;
  onBarcodeDetected?: (barcodes: DetectedBarcode[]) => void;
}

export interface DetectBarcodeResult {
  barcodes: DetectedBarcode[];
  success: boolean;
  error?: string;
}

// Check if Barcode Detection API is supported
const isBarcodeDetectionSupported = (): boolean => {
  return "BarcodeDetector" in globalThis;
};

// Get supported formats
const getSupportedFormats = async (): Promise<BarcodeFormat[]> => {
  if (!isBarcodeDetectionSupported()) {
    throw new Error("Barcode Detection API is not supported in this browser");
  }

  try {
    const formats = await BarcodeDetector.getSupportedFormats();
    return formats as BarcodeFormat[];
  } catch (error) {
    console.error("Failed to get supported formats:", error);
    throw new Error("Failed to get supported barcode formats");
  }
};

// Detect barcodes in an image
const detectBarcodes = async (
  imageSource: ImageBitmapSource,
  options: BarcodeDetectorOptions = {}
): Promise<DetectedBarcode[]> => {
  if (!isBarcodeDetectionSupported()) {
    throw new Error("Barcode Detection API is not supported in this browser");
  }

  try {
    const detector = new BarcodeDetector({ formats: options.formats ?? [] });
    const barcodes = await detector.detect(imageSource);
    return barcodes.map((barcode) => ({
      boundingBox: barcode.boundingBox,
      rawValue: barcode.rawValue,
      format: barcode.format as BarcodeFormat,
      cornerPoints: barcode.cornerPoints,
    }));
  } catch (error) {
    console.error("Failed to detect barcodes:", error);
    throw new Error("Failed to detect barcodes in image");
  }
};

/**
 * Hook for checking Barcode Detection API support and getting supported formats
 */
export const useBarcodeDetectionSupport = (
  options: Pick<UseDetectBarcodeOptions, "enabled" | "staleTime"> = {}
) => {
  const { enabled = true, staleTime = 5 * 60 * 1000 } = options;

  const {
    data: supportedFormats = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["barcode", "supported-formats"],
    queryFn: getSupportedFormats,
    enabled: enabled && isBarcodeDetectionSupported(),
    staleTime,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  const isSupported = isBarcodeDetectionSupported();
  const hasFormats = supportedFormats.length > 0;

  return {
    isSupported,
    supportedFormats,
    hasFormats,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

/**
 * Hook for detecting barcodes in images using the Barcode Detection API
 */
export const useDetectBarcode = ({
  formats = [],
  onBarcodeDetected,
}: Omit<UseDetectBarcodeOptions, "staleTime" | "enabled"> = {}) => {
  // Mutation for detecting barcodes
  const detectMutation = useMutation({
    mutationKey: ["barcode", "detect", formats],
    mutationFn: async (
      imageSource: ImageBitmapSource
    ): Promise<DetectBarcodeResult> => {
      try {
        if (!isBarcodeDetectionSupported()) {
          return {
            barcodes: [],
            success: false,
            error: "Barcode Detection API is not supported in this browser",
          };
        }

        const barcodes = await detectBarcodes(imageSource, { formats });

        onBarcodeDetected?.(barcodes);

        return {
          barcodes,
          success: true,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        return {
          barcodes: [],
          success: false,
          error: errorMessage,
        };
      }
    },
  });

  const detect = useMemo(
    () => detectMutation.mutateAsync,
    [detectMutation.mutateAsync]
  );

  // Detect barcodes from various image sources
  const detectFromElement = useCallback(
    (
      element:
        | HTMLImageElement
        | HTMLVideoElement
        | HTMLCanvasElement
        | SVGImageElement
    ) => {
      return detect(element);
    },
    [detect]
  );

  // Utility functions
  const hasBarcodes = useMemo(() => {
    return (
      detectMutation.data?.barcodes?.length &&
      detectMutation.data.barcodes.length > 0
    );
  }, [detectMutation.data]);

  const qrCodes = useMemo(() => {
    return (
      detectMutation.data?.barcodes.filter(
        (barcode) => barcode.format === "qr_code"
      ) || []
    );
  }, [detectMutation.data]);

  const linearBarcodes = useMemo(() => {
    const linearFormats: BarcodeFormat[] = [
      "code_128",
      "code_39",
      "code_93",
      "codabar",
      "ean_13",
      "ean_8",
      "itf",
      "upc_a",
      "upc_e",
    ];
    return (
      detectMutation.data?.barcodes.filter((barcode) =>
        linearFormats.includes(barcode.format)
      ) || []
    );
  }, [detectMutation.data]);

  const matrixBarcodes = useMemo(() => {
    const matrixFormats: BarcodeFormat[] = [
      "aztec",
      "data_matrix",
      "pdf417",
      "qr_code",
    ];
    return (
      detectMutation.data?.barcodes.filter((barcode) =>
        matrixFormats.includes(barcode.format)
      ) || []
    );
  }, [detectMutation.data]);

  return {
    // Detection methods
    detectFromElement,
    // Utilities
    hasBarcodes,
    qrCodes,
    linearBarcodes,
    matrixBarcodes,
  };
};

// Export types for external use
export type {
  BarcodeDetectorOptions as BarcodeDetectorOptionsType,
  BarcodeFormat as BarcodeFormatType,
  DetectBarcodeResult as DetectBarcodeResultType,
  DetectedBarcode as DetectedBarcodeType,
  UseDetectBarcodeOptions as UseDetectBarcodeOptionsType,
};
