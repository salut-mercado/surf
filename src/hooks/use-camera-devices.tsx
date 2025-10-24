import { useQuery } from "@tanstack/react-query";

export interface CameraDevice {
  deviceId: string;
  label: string;
  groupId: string;
}

export interface UseCameraDevicesOptions {
  enabled?: boolean;
  staleTime?: number;
  onDevicesLoaded?: (
    devices: CameraDevice[],
    defaultDevice: CameraDevice | null
  ) => void;
}

const requestDevices = async (): Promise<CameraDevice[]> => {
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  return mediaDevices
    .filter((device) => device.kind === "videoinput" && device.deviceId !== "")
    .map((device) => ({
      deviceId: device.deviceId,
      label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
      groupId: device.groupId,
    }));
};

const requestPermissions = async (): Promise<void> => {
  await navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: true,
    })
    .then((stream) => stream.getTracks().forEach((track) => track.stop()));
};

export const useCameraDevices = ({
  enabled = true,
  staleTime = 5 * 60 * 1000,
  onDevicesLoaded,
}: UseCameraDevicesOptions = {}) => {
  const {
    data: devices = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["camera", "devices"],
    queryFn: async (): Promise<CameraDevice[]> => {
      try {
        let devices = await requestDevices();
        if (devices.length === 0) {
          try {
            await requestPermissions();
            devices = await requestDevices();
          } catch {
            throw new Error("Failed to request camera permissions");
          }
        }
        onDevicesLoaded?.(devices, devices[0] || null);
        return devices;
      } catch (error) {
        console.error("Failed to enumerate camera devices:", error);
        throw new Error("Failed to access camera devices");
      }
    },
    enabled,
    staleTime,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });

  const hasDevices = devices.length > 0;
  const defaultDevice = devices[0] || null;

  return {
    devices,
    hasDevices,
    defaultDevice,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

export type {
  CameraDevice as CameraDeviceType,
  UseCameraDevicesOptions as UseCameraDevicesOptionsType,
};
