import {
  IconBarcode,
  IconBuildingFactory2,
  IconDashboardFilled,
  IconFolder,
  IconTruckDelivery,
} from "@tabler/icons-react";
import * as React from "react";
import { NavMain, type NavMainItem } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar";
import { TenantSwitcher } from "./tenant-switcher";

const data: { navMain: NavMainItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      items: [
        {
          title: "Overview",
          url: "/",
          icon: IconDashboardFilled,
        },
        {
          title: "Suppliers",
          url: "/suppliers",
          icon: IconTruckDelivery,
        },
        {
          title: "Producers",
          url: "/producers",
          icon: IconBuildingFactory2,
        },
        {
          title: "Categories",
          url: "/categories",
          icon: IconFolder,
        },
        {
          title: "SKUs",
          url: "/skus",
          icon: IconBarcode,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TenantSwitcher state={state} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
