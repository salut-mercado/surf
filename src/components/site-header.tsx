import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { useIsPos } from "~/hooks/use-is-pos";
import { LanguageToggle } from "~/components/common/language-toggle";
import { OnlineIndicator } from "~/components/common/online-indicator";
import { ThemeToggle } from "~/components/common/theme-toggle";
import { Button } from "~/components/ui/button";
import { Logo } from "~/components/common/logo";
import { PrinterStatus } from "./common/printer-status";

export function SiteHeader() {
  const [isPos] = useIsPos();
  const [location] = useLocation();
  const splits = location.split("/").filter(Boolean);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {!isPos ? (
          <>
            <SidebarTrigger className="-ml-1" />
          </>
        ) : (
          <>
            <Logo className="h-7" />
          </>
        )}
        {splits.length > 1 && (
          <>
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="-ml-1 size-7"
            >
              <Link href={`~/${splits.slice(0, -1).join("/")}`}>
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <PrinterStatus className="size-7" />
          <OnlineIndicator className="size-7" />
          <LanguageToggle variant="ghost" className="size-7" />
          <ThemeToggle variant="ghost" className="size-7" />
        </div>
      </div>
    </header>
  );
}
