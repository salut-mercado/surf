import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ViewMode = "pos" | "manager";

interface GlobalState {
  viewMode: ViewMode;
  preferredCameraDeviceId: string | undefined;
  setViewMode: (mode: ViewMode) => void;
  setPreferredCameraDeviceId: (deviceId: string | undefined) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      viewMode: "manager",
      preferredCameraDeviceId: undefined,
      setViewMode: (mode) => set({ viewMode: mode }),
      setPreferredCameraDeviceId: (deviceId) =>
        set({ preferredCameraDeviceId: deviceId }),
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
