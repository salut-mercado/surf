import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { SKUPriceDisplay } from "~/components/common/sku-price-display";
import { Button } from "~/components/ui/button";

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
        {
          accessorKey: "barcode",
          header: t("skus.columns.barcode", "Barcode"),
          cell: ({ row }) => (
            <span className="text-muted-foreground font-mono">
              {row.original.barcode}
            </span>
          ),
        },
        {
          id: "prices",
          enableColumnFilter: false,
          enableGlobalFilter: false,
          header: t("skus.columns.prices"),
          cell({ row }) {
            return (
              <SKUPriceDisplay
                retail_price_1={row.original.retail_price_1}
                retail_price_2={row.original.retail_price_2 ?? null}
                wholesale_price={row.original.wholesale_price ?? null}
                editableId={row.original.id}
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
