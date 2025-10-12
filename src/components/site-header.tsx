import { SidebarTrigger } from "~/components/ui/sidebar";
import { ThemeToggle } from "./common/theme-toggle";
import { ViewModeToggle } from "./view-mode-toggle";
import { useGlobalStore } from "~/store/global.store";

export function SiteHeader() {
  const viewMode = useGlobalStore((s) => s.viewMode);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {viewMode !== "pos" && <SidebarTrigger className="-ml-1" />}
        <div className="ml-auto flex items-center gap-2">
          <ViewModeToggle className="h-7" variant="outline" />
          <ThemeToggle variant="ghost" className="size-7" />
        </div>
      </div>
    </header>
  );
}
