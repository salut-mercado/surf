import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GlobalState {
  preferredCameraDeviceId: string | undefined;
  setPreferredCameraDeviceId: (deviceId: string | undefined) => void;
  receiptWidth: 80 | 58;
  setReceiptWidth: (width: 80 | 58) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      preferredCameraDeviceId: undefined,
      setPreferredCameraDeviceId: (deviceId) =>
        set({ preferredCameraDeviceId: deviceId }),
      receiptWidth: 80,
      setReceiptWidth: (width) => set({ receiptWidth: width }),
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
