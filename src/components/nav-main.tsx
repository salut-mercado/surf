import { type Icon } from "@tabler/icons-react";
import { useLocation } from "wouter";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const [location, navigate] = useLocation();
  console.log(location);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => navigate(item.url)}
                className={
                  (
                    item.url === "/"
                      ? location === item.url
                      : location.startsWith(item.url)
                  )
                    ? "bg-accent text-accent-foreground"
                    : ""
                }
              >
                {item.icon && (
                  <item.icon
                    className={cn({
                      "text-primary":
                        item.url === "/"
                          ? location === item.url
                          : location.startsWith(item.url),
                    })}
                  />
                )}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
