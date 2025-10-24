import { IconCamera, type TablerIcon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

export const CameraButton = ({
  variant,
  size,
  icon: Icon = IconCamera,
  buttonLabel,
  title,

  autoCloseOnBarcodeDetected,
  barcodeFormats,
  onBarcodeDetected,
  scanInterval,
}: CameraButtonProps) => {
  const preferredCameraDeviceId = useGlobalStore(
    (state) => state.preferredCameraDeviceId
  );
  const setPreferredCameraDeviceId = useGlobalStore(
    (state) => state.setPreferredCameraDeviceId
  );

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

  // Component controls
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startWebcam();
    } else {
      stopWebcam();
    }
  }, [isOpen, startWebcam, stopWebcam]);

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
              startWebcam();
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
