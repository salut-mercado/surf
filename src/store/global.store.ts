import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GlobalState {
  preferredCameraDeviceId: string | undefined;
  setPreferredCameraDeviceId: (deviceId: string | undefined) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      preferredCameraDeviceId: undefined,
      setPreferredCameraDeviceId: (deviceId) =>
        set({ preferredCameraDeviceId: deviceId }),
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
