import { AppLayout } from "./app-layout";
import { AppRoutes } from "./app-routes";
import { TenantSwitcher } from "./components/tenant-switcher";
import { useTenantStore } from "./store/tenant";

export default function App() {
  const unassigned = useTenantStore((s) => s.unassignedTenantId);

  if (unassigned) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Select Tenant</h1>
          <p className="text-muted-foreground">
            Choose your organization to continue.
          </p>
          <div className="flex justify-center">
            <TenantSwitcher />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
}
