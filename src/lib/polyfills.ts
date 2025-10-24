import { BarcodeDetector } from "barcode-detector/ponyfill";
(
  globalThis as unknown as { BarcodeDetector: typeof BarcodeDetector }
).BarcodeDetector ??= BarcodeDetector;
