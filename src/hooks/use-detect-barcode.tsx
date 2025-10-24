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
  options: UseDetectBarcodeOptions = {}
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
export const useDetectBarcode = (options: UseDetectBarcodeOptions = {}) => {
  const { formats = [] } = options;

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

  const detectFromImageData = useCallback(
    (imageData: ImageData) => {
      return detect(imageData);
    },
    [detect]
  );

  const detectFromBlob = useCallback(
    async (blob: Blob) => {
      try {
        const imageBitmap = await createImageBitmap(blob);
        return await detect(imageBitmap);
      } catch (error: unknown) {
        console.error(error);
        return {
          barcodes: [],
          success: false,
          error: "Failed to process image blob",
        };
      }
    },
    [detect]
  );

  const detectFromFile = useCallback(
    async (file: File) => {
      return detectFromBlob(file);
    },
    [detectFromBlob]
  );

  const detectFromDataURL = useCallback(
    async (dataURL: string) => {
      try {
        const response = await fetch(dataURL);
        const blob = await response.blob();
        return await detectFromBlob(blob);
      } catch (error: unknown) {
        console.error(error);
        return {
          barcodes: [],
          success: false,
          error: "Failed to process data URL",
        };
      }
    },
    [detectFromBlob]
  );

  // Utility functions
  const hasBarcodes = useMemo(() => {
    return (
      detectMutation.data?.barcodes?.length &&
      detectMutation.data.barcodes.length > 0
    );
  }, [detectMutation.data]);

  const firstBarcode = useMemo(() => {
    return detectMutation.data?.barcodes[0] || null;
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
    detectFromImageData,
    detectFromBlob,
    detectFromFile,
    detectFromDataURL,

    // State
    isDetecting: detectMutation.isPending,
    data: detectMutation.data,
    error: detectMutation.error,

    // Utilities
    hasBarcodes,
    firstBarcode,
    qrCodes,
    linearBarcodes,
    matrixBarcodes,

    // Actions
    reset: detectMutation.reset,
  };
};

// Export types for external use
export type {
  BarcodeFormat as BarcodeFormatType,
  DetectedBarcode as DetectedBarcodeType,
  BarcodeDetectorOptions as BarcodeDetectorOptionsType,
  UseDetectBarcodeOptions as UseDetectBarcodeOptionsType,
  DetectBarcodeResult as DetectBarcodeResultType,
};
