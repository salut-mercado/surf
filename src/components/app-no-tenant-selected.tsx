import { useAuth } from "~/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { useTenantStore } from "~/store/tenant";
import { TenantSwitcher } from "~/components/tenant-switcher";

export const TenantRequired = ({ children }: { children: React.ReactNode }) => {
  const unassigned = useTenantStore((s) => s.unassignedTenantId);
  const { logout } = useAuth();

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
          <p className="text-sm text-muted-foreground">
            or
            <Button variant="link" onClick={() => logout()}>
              Logout
            </Button>
          </p>
        </div>
      </div>
    );
  }
  return children;
};
