import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ViewMode = "pos" | "manager";

interface GlobalState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      viewMode: "pos",
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
