import { AppLayout } from "./app-layout";
import { AppRoutes } from "./app-routes";
import { Button } from "./components/ui/button";
import { useTenantStore } from "./store/tenant";

export default function App() {
  const unassigned = useTenantStore((s) => s.unassignedTenantId);
  const setTenantId = useTenantStore((s) => s.setTenantId);

  if (unassigned) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Select Tenant</h1>
          <p className="text-muted-foreground">
            Please enter your Tenant (Org) ID to continue.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget as HTMLFormElement);
              const tenant = String(data.get("tenant") || "").trim();
              if (tenant) setTenantId(tenant);
            }}
            className="space-y-2"
          >
            <input
              name="tenant"
              className="w-full border rounded px-3 py-2"
              placeholder="org_..."
              autoFocus
            />
            <div className="flex gap-2 justify-center">
              <Button type="submit">Continue</Button>
            </div>
          </form>
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
