import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { api } from "~/hooks/api";

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

export const useSelectedTenant = () => {
  const tenants = api.auth.useTenants();
  const selectedTenantId = useTenantStore((s) => s.tenantId);
  return tenants.data?.items?.find((t) => t.id === selectedTenantId);
};
