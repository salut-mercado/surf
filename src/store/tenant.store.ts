import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantState {
  tenantId: string | null;
  unassignedTenantId: boolean;
  setTenantId: (tenantId: string | null) => void;
  markUnassigned: (flag: boolean) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenantId: null,
      unassignedTenantId: true,
      setTenantId: (tenantId) => {
        set({ tenantId, unassignedTenantId: !tenantId });
      },
      markUnassigned: (flag) => set({ unassignedTenantId: flag }),
    }),
    {
      name: "tenant",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getTenantStore = () => useTenantStore.getState();
