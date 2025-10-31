import {
  IconAlertCircle,
  IconBarcode,
  IconBuildingFactory2,
  IconBuildingStore,
  IconDashboardFilled,
  IconFolder,
  IconMapPin,
  IconMapPinPlus,
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
import { api } from "~/hooks/api";
import { useSelectedTenant } from "~/store/tenant.store";
import { TenantSwitcher } from "./tenant-switcher";
import { UserRoleEnum } from "@salut-mercado/octo-client";

const data: { navMain: NavMainItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      roles: [UserRoleEnum.manager],
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
    { title: "Stores", url: "/stores", icon: IconBuildingStore, loading: true },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  const stores = api.stores.useGetAll({ limit: 1000 });
  const selectedTenant = useSelectedTenant();

  const navMain = React.useMemo(() => {
    if (!selectedTenant) {
      return [];
    }
    const allStores = stores.data?.pages.flatMap((page) => page.items) ?? [];
    if (!stores.data) {
      return data.navMain;
    }
    const clone = data.navMain;
    const storesItem = clone.find((item) => item.url === "/stores")!;
    storesItem.loading = false;
    storesItem.items = allStores.map((store) => ({
      title: store.address,
      url: `/stores/${store.id}`,
      icon: IconMapPin,
    }));
    storesItem.items.push({
      title: "Create Store",
      url: "/stores/create",
      icon: IconMapPinPlus,
      roles: [UserRoleEnum.manager],
    })
    if (selectedTenant.role !== UserRoleEnum.manager) {
      storesItem.items.push({
        title: "No stores assigned",
        url: "#",
        icon: IconAlertCircle,
        disabled: true,
      })
    }
    return data.navMain;
  }, [stores, selectedTenant]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TenantSwitcher state={state} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} role={selectedTenant?.role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
