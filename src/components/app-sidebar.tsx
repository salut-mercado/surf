import {
  IconBarcode,
  IconBuildingFactory2,
  IconDashboardFilled,
  IconFolder,
  IconTruckDelivery,
} from "@tabler/icons-react";
import * as React from "react";
import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "~/components/ui/sidebar";
import { TenantSwitcher } from "./tenant-switcher";

const data = {
  navMain: [
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TenantSwitcher state={state} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
