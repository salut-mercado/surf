import { useEffect, useRef, type RefObject } from "react";

const listener = (
  ref: RefObject<string>,
  onBarcodeDetected: (barcode: string) => void,
  onInvalidBarcode?: () => void,
  timeout?: number
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (event: KeyboardEvent) => {
    const checks = [
      event.key.length === 1,
      event.key === "Enter",
      event.key.match(/^[0-9]$/),
    ];
    if (!checks.some(Boolean)) {
      return;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    timeoutId = setTimeout(() => {
      return (ref.current = "");
    }, timeout);
    if (event.key === "Enter") {
      if (ref.current.length === 0) {
        return;
      }
      if (ref.current.length !== 8 && ref.current.length !== 13) {
        console.warn("Invalid barcode length");
        onInvalidBarcode?.();
        ref.current = "";
        return;
      }
      onBarcodeDetected(ref.current);
      ref.current = "";
      return;
    }
    ref.current += event.key;
  };
};

export const useDetectBarcodeInput = ({
  onBarcodeDetected,
  onInvalidBarcode,
  timeout = 1000,
}: {
  onBarcodeDetected: (barcode: string) => void;
  onInvalidBarcode?: () => void;
  timeout?: number;
}) => {
  const barcodeRef = useRef<string>("");

  useEffect(() => {
    const eventListener = listener(
      barcodeRef,
      onBarcodeDetected,
      onInvalidBarcode,
      timeout
    );
    window.addEventListener("keydown", eventListener);
    return () => {
      window.removeEventListener("keydown", eventListener);
    };
  }, [onBarcodeDetected, onInvalidBarcode, timeout]);

  return barcodeRef.current;
};
