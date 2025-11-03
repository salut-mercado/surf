import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import { DollarSignIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

export const FinancialInfo = ({
  sku,
  className,
  ...props
}: { sku: SKUReturnSchema } & ComponentProps<typeof Card>) => {
  const { t } = useTranslation();
  return (
    <Card
      className={cn("border-primary/20 bg-primary/5", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSignIcon className="size-4 text-primary" />
          {t("skus.view.financialInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4">
          <label className="text-sm font-medium text-muted-foreground">
            {t("skus.view.wholesalePrice")}
          </label>
          <p className="text-4xl font-bold mt-2 text-primary">
            {sku.wholesalePrice != null
              ? `€${sku.wholesalePrice}`
              : t("common.n/a")}
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          <PercentageItem label={t("skus.view.vat")} value={sku.vatPercent} />
          <PercentageItem
            label={t("skus.view.alcohol")}
            value={sku.alcoholPercent}
          />
          <PercentageItem
            label={t("skus.view.naturalLoss")}
            value={sku.naturalLossPercent}
          />
        </div>
      </CardContent>
    </Card>
  );
};

function PercentageItem({ label, value }: { label: string; value: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">
        {value != null ? `${value}%` : t("common.n/a")}
      </span>
    </div>
  );
}
