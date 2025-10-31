import { SidebarTrigger } from "~/components/ui/sidebar";
import { ThemeToggle } from "./common/theme-toggle";
import { useIsPos } from "~/hooks/use-is-pos";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

export function SiteHeader() {
  const [isPos, storeId] = useIsPos();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {isPos ? (
          <Button asChild variant="outline" size="icon-sm">
            <Link href={`~/stores/${storeId}/`} className="-ml-1">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        ) : (
          <SidebarTrigger className="-ml-1" />
        )}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle variant="ghost" className="size-7" />
        </div>
      </div>
    </header>
  );
}
