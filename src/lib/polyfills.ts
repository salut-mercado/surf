import { BarcodeDetector } from "barcode-detector/ponyfill";
(
  globalThis as unknown as { BarcodeDetector: typeof BarcodeDetector }
).BarcodeDetector ??= BarcodeDetector;

(
  window as unknown as { initBarcodeDetector: () => Promise<void> }
).initBarcodeDetector();
