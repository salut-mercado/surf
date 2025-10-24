import { IconCamera, type TablerIcon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import { useCameraDevices } from "~/hooks/use-camera-devices";
import { useDetectBarcode } from "~/hooks/use-detect-barcode";
import { useWebcam } from "~/hooks/use-webcam";
import { useGlobalStore } from "~/store/global.store";

export type CameraButtonRef = React.RefObject<{
  getVideoElement: () => HTMLVideoElement | null;
}>;

type CameraButtonProps = {
  // Button
  title: string;
  buttonLabel?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  icon?: TablerIcon | LucideIcon;

  // Barcode detection
  barcodeFormats?: BarcodeFormat[];
  onBarcodeDetected?: (barcodes: DetectedBarcode[]) => void;
  autoCloseOnBarcodeDetected?: boolean;
  scanInterval?: number;
};

// TODO: Add error handling

export const CameraButton = ({
  variant,
  size,
  icon: Icon = IconCamera,
  buttonLabel,
  title,

  autoCloseOnBarcodeDetected,
  barcodeFormats = ["ean_13", "ean_8"],
  onBarcodeDetected,
  scanInterval = 200,
}: CameraButtonProps) => {
  const preferredCameraDeviceId = useGlobalStore(
    (state) => state.preferredCameraDeviceId
  );
  const setPreferredCameraDeviceId = useGlobalStore(
    (state) => state.setPreferredCameraDeviceId
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Camera
  const devices = useCameraDevices({
    onDevicesLoaded(_, defaultDevice) {
      if (defaultDevice && preferredCameraDeviceId === undefined) {
        setPreferredCameraDeviceId(defaultDevice.deviceId);
      }
    },
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    start: startWebcam,
    stop: stopWebcam,
    isStarting,
    isStopping,
  } = useWebcam({
    ref: videoRef,
    deviceId: preferredCameraDeviceId,
    facingMode: "environment",
    width: 1000,
    height: 1000,
    frameRate: 30,
    withAudio: false,
  });

  const { detectFromElement } = useDetectBarcode({
    formats: barcodeFormats,
    onBarcodeDetected(barcodes) {
      if (!barcodes.length) return;
      if (autoCloseOnBarcodeDetected) {
        setIsOpen(false);
      }
      onBarcodeDetected?.(barcodes);
    },
  });

  const startWebcamWithDetection = useCallback(() => {
    startWebcam();
    intervalRef.current = setInterval(() => {
      if (!videoRef.current) return;
      detectFromElement(videoRef.current);
    }, scanInterval);
  }, [startWebcam, detectFromElement, scanInterval]);

  const stopWebcamWithDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopWebcam();
  }, [stopWebcam]);

  // Component controls
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startWebcamWithDetection();
    } else {
      stopWebcamWithDetection();
    }
  }, [isOpen, startWebcamWithDetection, stopWebcamWithDetection]);

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
            disabled={devices.isLoading}
            value={preferredCameraDeviceId}
            onValueChange={(newValue) => {
              setPreferredCameraDeviceId(newValue);
              startWebcamWithDetection();
            }}
          >
            <SelectTrigger>
              {devices.isLoading ? (
                <Spinner />
              ) : (
                <SelectValue placeholder="Select a device" />
              )}
            </SelectTrigger>
            <SelectContent>
              {devices.devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AlertDialogHeader>
        <div className="bg-muted rounded-md aspect-square w-full overflow-hidden grid place-items-center">
          {(isStarting || isStopping) && <Spinner />}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full object-cover"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
