import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useIsMobile } from "~/hooks/common/use-mobile";
import { cn } from "~/lib/utils";

import type { TenantItem, TenantsResponse } from "@salut-mercado/octo-client";
import { IconBuildingFactory2 } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { sidebarMenuButtonVariants } from "~/components/ui/sidebar";
import { api as hooks } from "~/hooks/api";
import { useTenantStore } from "~/store/tenant";

export function TenantSwitcher({
  state = "expanded",
}: {
  state?: "expanded" | "collapsed";
}) {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const tenantId = useTenantStore((s) => s.tenantId);
  const setTenantId = useTenantStore((s) => s.setTenantId);
  const { data: tenants, isLoading } = hooks.auth.useTenants();

  const activeTenant = React.useMemo<TenantItem | null>(() => {
    if (!tenants || !("items" in tenants)) return null;
    const list = tenants.items;
    if (!Array.isArray(list) || list.length === 0) return null;
    const found = list.find((t) => t.id === tenantId);
    return found ?? list[0];
  }, [tenants, tenantId]);

  if (isLoading || !activeTenant) {
    return null;
  }

  return (
    <ul className="flex w-full min-w-0 flex-col gap-1">
      <li>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MenuButton
              size="lg"
              state={state}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <IconBuildingFactory2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeTenant?.name ?? "Tenant"}
                </span>
                <span className="truncate text-xs">
                  {activeTenant?.id ?? ""}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </MenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {(() => {
              const list =
                (tenants as TenantsResponse | undefined)?.items ?? [];
              return list;
            })().map((t: TenantItem) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => {
                  setTenantId(t.id);
                  queryClient.invalidateQueries({ predicate: () => true });
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <IconBuildingFactory2 className="size-3.5 shrink-0" />
                </div>
                {t.name ?? t.id}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>
  );
}

function MenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  state = "expanded",
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  state?: "expanded" | "collapsed";
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button";
  const isMobile = useIsMobile();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}
