import { TrendingUpIcon, DollarSignIcon, CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { StoreReturnSchema } from "@salut-mercado/octo-client";
import { Card } from "~/components/ui/card";

export function StoreOverview({ id }: StoreReturnSchema) {
  const { t } = useTranslation();
  const stats = {
    id,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  };

  const overviewItems = [
    {
      label: t("stores.view.overview.salesToday"),
      value: `€${stats.today.toFixed(2)}`,
      icon: DollarSignIcon,
      change: "0%",
      changeType: "neutral" as const,
    },
    {
      label: t("stores.view.overview.salesThisWeek"),
      value: `€${stats.thisWeek.toFixed(2)}`,
      icon: TrendingUpIcon,
      change: "0%",
      changeType: "neutral" as const,
    },
    {
      label: t("stores.view.overview.salesThisMonth"),
      value: `€${stats.thisMonth.toFixed(2)}`,
      icon: CalendarIcon,
      change: "0%",
      changeType: "neutral" as const,
    },
  ];

  return (
    <section className="mb-10">
      <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
        {t("stores.view.overview.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {overviewItems.map((item) => (
          <Card
            key={item.label}
            className="p-6 border-border bg-card hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span
                className={`text-sm font-medium ${item.changeType === "positive" ? "text-green-600" : item.changeType === "negative" ? "text-red-600" : "text-muted-foreground"}`}
              >
                {item.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
