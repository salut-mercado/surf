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
import { useTranslation } from "react-i18next";
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

const getNavData = (t: (key: string) => string): { navMain: NavMainItem[] } => ({
  navMain: [
    {
      title: t("navigation.dashboard"),
      url: "/",
      roles: [UserRoleEnum.manager],
      items: [
        {
          title: t("navigation.overview"),
          url: "/",
          icon: IconDashboardFilled,
        },
        {
          title: t("navigation.suppliers"),
          url: "/suppliers",
          icon: IconTruckDelivery,
        },
        {
          title: t("navigation.producers"),
          url: "/producers",
          icon: IconBuildingFactory2,
        },
        {
          title: t("navigation.categories"),
          url: "/categories",
          icon: IconFolder,
        },
        {
          title: t("navigation.skus"),
          url: "/skus",
          icon: IconBarcode,
        },
      ],
    },
    { title: t("navigation.stores"), url: "/stores", icon: IconBuildingStore, loading: true },
  ],
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { t } = useTranslation();

  const stores = api.stores.useGetAll({ limit: 1000 });
  const selectedTenant = useSelectedTenant();

  const navMain = React.useMemo(() => {
    const data = getNavData(t);
    if (!selectedTenant) {
      return data.navMain;
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
      title: t("navigation.createStore"),
      url: "/stores/create",
      icon: IconMapPinPlus,
      roles: [UserRoleEnum.manager],
    })
    if (selectedTenant.role !== UserRoleEnum.manager && allStores.length === 0) {
      storesItem.items.push({
        title: t("navigation.noStoresAssigned"),
        url: "#",
        icon: IconAlertCircle,
        disabled: true,
      })
    }
    return data.navMain;
  }, [stores, selectedTenant, t]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TenantSwitcher state={state} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} role={selectedTenant?.role ?? UserRoleEnum.seller} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
