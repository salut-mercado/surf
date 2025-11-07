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
        <div className="grid grid-cols-2 gap-2">
          <PriceItem
            label="skus.view.wholesalePrice"
            value={sku.wholesale_price}
            className="col-span-2"
          />
          <PriceItem
            label="skus.view.retailPrice1"
            value={sku.retail_price_1}
          />
          <PriceItem
            label="skus.view.retailPrice2"
            value={sku.retail_price_2}
          />
        </div>
        <Separator />
        <div className="space-y-4">
          <PercentageItem label={t("skus.view.vat")} value={sku.vat_percent} />
          <PercentageItem
            label={t("skus.view.alcohol")}
            value={sku.alcohol_percent}
          />
          <PercentageItem
            label={t("skus.view.naturalLoss")}
            value={sku.natural_loss_percent}
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

function PriceItem({
  label,
  value,
  className,
  ...props
}: { label: string; value?: number | null } & ComponentProps<"div">) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "px-2 py-4 border rounded flex flex-col items-center justify-center text-center",
        className
      )}
      {...props}
    >
      <label className="text-sm font-medium text-muted-foreground">
        {t(label)}
      </label>
      <p className="text-4xl font-bold mt-2 text-primary">
        {value != null ? `€${value}` : t("common.n/a")}
      </p>
    </div>
  );
}
