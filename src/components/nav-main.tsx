import type { TablerIcon } from "@tabler/icons-react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "wouter";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import { Spinner } from "./ui/spinner";
import type { UserRoleEnum } from "@salut-mercado/octo-client";
import { Fragment } from "react";

export type NavMainItem = {
  title: string;
  url: string;
  icon?: LucideIcon | TablerIcon;
  isActive?: boolean;
  items?: Omit<NavMainItem, "items">[];
  loading?: boolean;
  roles?: UserRoleEnum[];
  disabled?: boolean;
};

export function NavMain({
  items,
  role,
}: {
  items: NavMainItem[];
  role: UserRoleEnum | undefined;
}) {
  const [location] = useLocation();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (!role) {
            return <Fragment key={item.title} />;
          }
          if (item.roles && !item.roles.includes(role)) {
            return <Fragment key={item.title} />;
          }
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {item.loading && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <button disabled>
                            <Spinner />
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      if (subItem.roles && !subItem.roles.includes(role)) {
                        return <Fragment key={subItem.title} />;
                      }
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              subItem.url === "/"
                                ? location === subItem.url
                                : location.startsWith(subItem.url)
                            }
                          >
                            {subItem.disabled ? (
                              <button disabled>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </button>
                            ) : (
                              <Link href={subItem.url}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </Link>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
