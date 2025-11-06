import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import { RulerIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const Specifications = ({
  sku,
  className,
}: {
  sku: SKUReturnSchema;
} & ComponentProps<typeof Card>) => {
  const { t } = useTranslation();
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <RulerIcon className="size-4 text-muted-foreground" />
          {t("skus.view.measurementsAndSpecifications")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <MetricCard
            label={t("skus.view.netWeight")}
            value={sku.net_weight.toLocaleString()}
            unit={sku.unit_measurement.toLowerCase()}
          />
          <MetricCard
            label={t("skus.view.shelfLifetime")}
            value={sku.shelf_lifetime.toString()}
            unit={t("skus.view.days")}
          />
          <MetricCard
            label={t("skus.view.unitMeasurement")}
            value={sku.unit_measurement}
          />
          <MetricCard
            label={t("skus.view.maxOnCheckout")}
            value={sku.max_on_checkout.toString()}
            unit={t("skus.view.units")}
          />
        </div>
      </CardContent>
    </Card>
  );
};

function MetricCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <p className="mt-2 text-2xl font-semibold">
        {value}
        {unit && (
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
