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

export const CameraButton = ({
  onStreamChange,
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
}: {
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    devices,
    // error,
    // hasDevices,
    isLoading: isLoadingDevices,
    defaultDevice,
    refetch: refetchDevices,
  } = useCameraDevices();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    defaultDevice?.deviceId ?? "invalid"
  );

  const {
    videoRef: webcamVideoRef,
    isActive: webcamIsActive,
    start: startWebcam,
    stop: stopWebcam,
    isStarting: webcamIsStarting,
    isStopping: webcamIsStopping,
  } = useWebcam({
    deviceId:
      selectedDeviceId === "invalid"
        ? defaultDevice?.deviceId
        : selectedDeviceId,
    constraints,
    onStreamChange,
  });

  // Barcode detection hook
  const { detectFromElement } = useDetectBarcode({
    formats: barcodeFormats,
  });

  useEffect(() => {
    const timoutId = setTimeout(() => {
      refetchDevices();
    }, 150);
    return () => clearTimeout(timoutId);
  }, [refetchDevices]);

  // Start/stop barcode scanning
  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopScanning();
    setIsOpen(false);
    setSelectedDeviceId("invalid");
    stopWebcam();
  }, [stopScanning, setIsOpen, stopWebcam]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(openValue) => {
        setIsOpen(openValue);
        if (!openValue) {
          reset();
        }
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
            value={selectedDeviceId}
            onValueChange={(newValue) => {
              setSelectedDeviceId(newValue);
              if (newValue !== "invalid") {
                startWebcam(newValue);
              } else {
                stopWebcam();
              }
            }}
          >
            <SelectTrigger>
              {isLoadingDevices ? (
                <Spinner />
              ) : (
                <SelectValue
                  placeholder="Select a device"
                  defaultValue="invalid"
                />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invalid" disabled>
                Please choose a camera device
              </SelectItem>
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
        <video
          className="w-full"
          ref={webcamVideoRef}
          autoPlay
          playsInline
          key={selectedDeviceId}
        />
        {webcamIsStarting && <Spinner />}
        {webcamIsStopping && <Spinner />}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
