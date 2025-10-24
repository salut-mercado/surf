import { IconCamera, type TablerIcon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useCameraDevices } from "~/hooks/use-camera-devices";
import {
  useWebcam,
  type UseWebcamOptions,
  type WebcamConstraints,
} from "~/hooks/use-webcam";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { useDetectBarcode } from "~/hooks/use-detect-barcode";

export type CameraButtonRef = React.RefObject<{
  getVideoElement: () => HTMLVideoElement | null;
}>;

type CameraButtonProps = {
  title: string;
  buttonLabel?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  onStreamChange?: UseWebcamOptions["onStreamChange"];
  barcodeFormats?: BarcodeFormat[];
  onBarcodeDetected?: (barcodes: DetectedBarcode[]) => void;
  autoCloseOnBarcodeDetected?: boolean;
  scanInterval?: number;
  icon?: TablerIcon | LucideIcon;
  constraints?: WebcamConstraints;
};

export const CameraButton = ({
  title,
  buttonLabel,
  size,
  variant,
  icon: Icon = IconCamera,
  constraints,
  barcodeFormats = ["ean_13", "ean_8"],
  scanInterval = 200,
  onBarcodeDetected,
  autoCloseOnBarcodeDetected,
  onStreamChange,
}: CameraButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    devices,
    // error,
    // hasDevices,
    isLoading: isLoadingDevices,
    refetch: refetchDevices,
  } = useCameraDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const timoutId = setTimeout(() => {
      refetchDevices();
    }, 150);
    return () => clearTimeout(timoutId);
  }, [refetchDevices]);
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(openValue) => {
        setIsOpen(openValue);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} onClick={() => setIsOpen(true)}>
          <Icon className="size-4" />
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="flex md:flex-row justify-between items-center">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <Select
            disabled={isLoadingDevices}
            value={selectedDeviceId ?? ""}
            onValueChange={(newValue) => {
              setSelectedDeviceId(newValue);
            }}
          >
            <SelectTrigger>
              {isLoadingDevices ? (
                <Spinner />
              ) : (
                <SelectValue placeholder="Select a device" />
              )}
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) =>
                device.deviceId ? (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </SelectItem>
                ) : (
                  <Fragment key={device.deviceId} />
                )
              )}
            </SelectContent>
          </Select>
        </AlertDialogHeader>
        {selectedDeviceId && (
          <CameraButtonContent
            deviceId={selectedDeviceId}
            autoCloseOnBarcodeDetected={autoCloseOnBarcodeDetected}
            barcodeFormats={barcodeFormats}
            constraints={constraints}
            onBarcodeDetected={(barcodes) => {
              onBarcodeDetected?.(barcodes);
              if (autoCloseOnBarcodeDetected) {
                setIsOpen(false);
              }
            }}
            onStreamChange={onStreamChange}
            scanInterval={scanInterval}
            key={selectedDeviceId}
          />
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const CameraButtonContent = ({
  autoCloseOnBarcodeDetected,
  barcodeFormats,
  constraints,
  onBarcodeDetected,
  onStreamChange,
  scanInterval,
  deviceId,
}: Omit<
  CameraButtonProps,
  "title" | "buttonLabel" | "size" | "variant" | "icon"
> & { deviceId: string }) => {
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    videoRef: webcamVideoRef,
    isActive: webcamIsActive,
    stop: stopWebcam,
    isStarting: webcamIsStarting,
    isStopping: webcamIsStopping,
  } = useWebcam({
    constraints,
    onStreamChange,
    deviceId,
    autoStart: true,
  });

  // Barcode detection hook
  const { detectFromElement } = useDetectBarcode({
    formats: barcodeFormats,
  });

  // Start/stop barcode scanning
  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopScanning();
    stopWebcam();
  }, [stopScanning, stopWebcam]);

  const startScanning = useCallback(() => {
    if (!webcamVideoRef.current) return;

    scanIntervalRef.current = setInterval(async () => {
      if (webcamVideoRef.current && webcamIsActive) {
        try {
          const result = await detectFromElement(webcamVideoRef.current);
          if (result.success && result.barcodes.length > 0) {
            onBarcodeDetected?.(result.barcodes);
            if (autoCloseOnBarcodeDetected) {
              reset();
            }
          }
        } catch (error) {
          console.error("Barcode detection error:", error);
        }
      }
    }, scanInterval);
  }, [
    webcamVideoRef,
    scanInterval,
    webcamIsActive,
    detectFromElement,
    onBarcodeDetected,
    autoCloseOnBarcodeDetected,
    reset,
  ]);

  // Auto-start scanning when camera is active
  useEffect(() => {
    if (webcamIsActive) {
      startScanning();
    } else {
      stopScanning();
    }
    return () => stopScanning();
  }, [webcamIsActive, startScanning, stopScanning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopScanning();
  }, [stopScanning]);

  return (
    <>
      {webcamIsStarting && <Spinner />}
      <video className="w-full" ref={webcamVideoRef} autoPlay playsInline />
      {webcamIsStopping && <Spinner />}
    </>
  );
};
