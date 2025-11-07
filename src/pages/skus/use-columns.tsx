import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { AlertCircleIcon, ChevronRight } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { formatPrice } from "~/lib/utils/format-price";

export const useColumns = (): ColumnDef<SKUReturnSchema>[] => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<SKUReturnSchema>[]>(
    () =>
      [
        {
          accessorKey: "name",
          header: t("skus.columns.name"),
          filterFn: "includesString",
          enableColumnFilter: true,
        },
        { accessorKey: "unit_measurement", header: t("skus.columns.unit") },
        { accessorKey: "net_weight", header: t("skus.columns.netWeight") },
        {
          id: "prices",
          enableColumnFilter: false,
          enableGlobalFilter: false,
          header: t("skus.columns.prices"),
          cell({ row }) {
            return (
              <PriceDisplay
                retail_price_1={row.original.retail_price_1}
                retail_price_2={row.original.retail_price_2 ?? null}
                wholesale_price={row.original.wholesale_price ?? null}
              />
            );
          },
        },
        {
          id: "actions",
          size: 40,
          cell: ({ row }) => (
            <ActionRow id={row.original.id} text={t("skus.columns.view")} />
          ),
        },
      ] satisfies ColumnDef<SKUReturnSchema>[],
    [t]
  );

  return columns;
};

const ActionRow = memo(({ id, text }: { id: string; text: string }) => {
  return (
    <div className="flex justify-end">
      <Button asChild variant="ghost">
        <Link href={`/${id}`}>
          {text} <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
});
ActionRow.displayName = "ActionRow";

function PriceDisplay({
  retail_price_1,
  retail_price_2,
  wholesale_price,
}: {
  retail_price_1: number;
  retail_price_2: number | null;
  wholesale_price: number | null;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {/* Base Retail Price - Primary badge with blue accent */}
      <div className="inline-flex flex-col gap-0.5">
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
          {t("skus.view.retailPrice1Short")}
        </span>
        <Badge
          className={cn("font-mono text-xs", {
            "bg-transparent border-yellow-500 text-primary dark:text-primary-foreground":
              retail_price_1 === 0,
          })}
        >
          {retail_price_1 === 0 ? (
            <AlertCircleIcon className="size-2 text-yellow-500" />
          ) : null}
          {formatPrice(retail_price_1)}
        </Badge>
      </div>

      {/* Special Retail Price - Accent badge with amber/orange tones */}
      {retail_price_2 ? (
        <div className="inline-flex flex-col gap-0.5">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide">
            {t("skus.view.retailPrice2Short")}
          </span>
          <Badge className="font-mono text-xs bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800">
            {formatPrice(retail_price_2)}
          </Badge>
        </div>
      ) : null}

      {/* Wholesale Price - Subtle outline badge with purple accent */}
      {wholesale_price ? (
        <div className="inline-flex flex-col gap-0.5">
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wide">
            {t("skus.view.wholesalePriceShort")}
          </span>
          <Badge
            variant="outline"
            className="font-mono text-xs border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"
          >
            {formatPrice(wholesale_price)}
          </Badge>
        </div>
      ) : null}
    </div>
  );
}
