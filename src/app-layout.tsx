import { useLocation } from "wouter";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { useTenantStore } from "~/store/tenant";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [location] = useLocation();
  const isAuthPage = location.startsWith("/auth");
  const unassigned = useTenantStore((s) => s.unassignedTenantId);
  const hideLayout = unassigned || isAuthPage;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="!bg-border"
    >
      {!hideLayout && <AppSidebar variant="sidebar" />}
      <SidebarInset>
        {!hideLayout && <SiteHeader />}
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
