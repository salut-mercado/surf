import { AlertCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { formatPrice } from "~/lib/utils/format-price";

export function SKUPriceDisplay({
  retail_price_1,
  retail_price_2,
  wholesale_price,
}: {
  retail_price_1: number;
  retail_price_2: number | null;
  wholesale_price?: number | null;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {/* Base Retail Price - Primary badge with blue accent */}
      <div className="inline-flex flex-col gap-0.5">
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
          {t("skus.view.retailPrice1Short")}
        </span>
        {retail_price_1 === 0 ? (
          <AlertPriceDisplay price={retail_price_1} />
        ) : (
          <Badge className="font-mono text-xs">
            {formatPrice(retail_price_1)}
          </Badge>
        )}
      </div>

      {/* Special Retail Price - Accent badge with amber/orange tones */}
      {retail_price_2 ? (
        <div className="inline-flex flex-col gap-0.5">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide">
            {t("skus.view.retailPrice2Short")}
          </span>
          {retail_price_2 === 0 ? (
            <AlertPriceDisplay price={retail_price_2} />
          ) : (
            <Badge className="font-mono text-xs bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800">
              {formatPrice(retail_price_2)}
            </Badge>
          )}
        </div>
      ) : null}

      {/* Wholesale Price - Subtle outline badge with purple accent */}
      {wholesale_price ? (
        <div className="inline-flex flex-col gap-0.5">
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wide">
            {t("skus.view.wholesalePriceShort")}
          </span>
          {wholesale_price === 0 ? (
            <AlertPriceDisplay price={wholesale_price} />
          ) : (
            <Badge
              variant="outline"
              className="font-mono text-xs border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"
            >
              {formatPrice(wholesale_price)}
            </Badge>
          )}
        </div>
      ) : null}
    </div>
  );
}

const AlertPriceDisplay = ({ price }: { price: number }) => {
  return (
    <Badge
      className={cn("font-mono text-xs", {
        "bg-transparent border-yellow-500 text-primary dark:text-primary-foreground": true,
      })}
    >
      <AlertCircleIcon className="size-2 text-yellow-500" />
      {formatPrice(price)}
    </Badge>
  );
};
