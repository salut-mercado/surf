import {
  IconBarcode,
  IconBuildingFactory2,
  IconFolder,
  IconInnerShadowTop,
  IconTruckDelivery,
} from "@tabler/icons-react";
import * as React from "react";
import { Link } from "wouter";
import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="~/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Salut</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
