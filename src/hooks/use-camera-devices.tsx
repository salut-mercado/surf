import { useQuery } from "@tanstack/react-query";

export interface CameraDevice {
  deviceId: string;
  label: string;
  groupId: string;
}

export interface UseCameraDevicesOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useCameraDevices = (options: UseCameraDevicesOptions = {}) => {
  const { enabled = true, staleTime = 5 * 60 * 1000 } = options;

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
        await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        return mediaDevices
          .filter((device) => device.kind === "videoinput")
          .map((device) => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
            groupId: device.groupId,
          }));
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
