import { IconLink } from "@tabler/icons-react";
import { BarChart3, CreditCard, Package, Users } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export const ActionRow = ({ id }: { id: string }) => {
  const actions = [
    {
      href: `/${id}/pos`,
      icon: CreditCard,
      label: "POS",
      description: "Point of Sale",
    },
    {
      href: `/stores/${id}/inventory`,
      icon: Package,
      label: "Inventory",
      description: "Stock Management",
    },
    {
      href: `/${id}/reports`,
      icon: BarChart3,
      label: "Reports",
      description: "Sales & Analytics",
      disabled: true,
    },
    {
      href: `/${id}/staff`,
      icon: Users,
      label: "Staff",
      description: "Employee Management",
      disabled: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {actions.map((action) => {
        const Component = action.disabled ? "div" : Link;
        return (
          <Component
            key={action.href}
            href={action.href}
            className={cn(
              action.disabled && "cursor-not-allowed pointer-events-none"
            )}
          >
            <Card
              className={cn(
                "group cursor-pointer transition-all hover:shadow-md relative",
                {
                  "hover:scale-[1.02] active:scale-[0.98]": !action.disabled,
                  "opacity-50 cursor-not-allowed": action.disabled,
                }
              )}
            >
              {!action.disabled && (
                <IconLink className="size-4 absolute top-2 right-2" />
              )}
              <CardContent className="p-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex items-center justify-center rounded-lg bg-secondary transition-colors group-hover:scale-110">
                    <action.icon className="size-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-semibold text-sm">{action.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Component>
        );
      })}
    </div>
  );
};
