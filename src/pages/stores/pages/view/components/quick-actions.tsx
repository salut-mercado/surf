import type { StoreReturnSchema } from "@salut-mercado/octo-client";
import {
  BarChart3Icon,
  CreditCardIcon,
  ExternalLinkIcon,
  PackageIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Card } from "~/components/ui/card";

const actions = [
  {
    title: "stores.actions.pos",
    description: "stores.actions.posDescription",
    icon: CreditCardIcon,
    href: "/pos",
    disabled: false,
  },
  {
    title: "stores.actions.inventory",
    description: "stores.actions.inventoryDescription",
    icon: PackageIcon,
    href: "/inventory",
    disabled: false,
  },
  {
    title: "stores.actions.reports",
    description: "stores.actions.reportsDescription",
    icon: BarChart3Icon,
    href: "#",
    disabled: true,
  },
  {
    title: "stores.actions.staff",
    description: "stores.actions.staffDescription",
    icon: UsersIcon,
    href: "#",
    disabled: true,
  },
];

export function QuickActions({ id: storeId }: StoreReturnSchema) {
  const { t } = useTranslation();
  return (
    <section className="mb-10">
      <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
        {t("stores.actions.quickActions")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Card
            key={`~/stores/${storeId}${action.href}`}
            className={`group relative overflow-hidden border border-border/60 bg-card transition-all duration-300 ${
              action.disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {!action.disabled && (
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-80 bg-muted/40" />
            )}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
            <Link href={`~/stores/${storeId}${action.href}`} asChild>
              <button
                disabled={action.disabled}
                className={`relative z-10 flex w-full items-start justify-between gap-4 p-6 text-left ${
                  action.disabled ? "pointer-events-none" : "cursor-pointer"
                }`}
              >
                <div
                  className={`rounded-xl border transition-colors duration-300 ${
                    action.disabled
                      ? "border-transparent bg-muted"
                      : "border-border/50 bg-muted shadow-sm group-hover:border-border group-hover:bg-secondary/60"
                  }`}
                >
                  <div className="p-2.5">
                    <action.icon className="h-5 w-5 text-foreground" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {t(action.title)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(action.description)}
                  </p>
                </div>
                {!action.disabled && (
                  <ExternalLinkIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                )}
              </button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
