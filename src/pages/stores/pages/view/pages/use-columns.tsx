import type { StoreInventoryItemSchema } from "@salut-mercado/octo-client";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SKUPriceDisplay } from "~/components/common/sku-price-display";

export const useColumns = (): ColumnDef<StoreInventoryItemSchema>[] => {
  const { t } = useTranslation();
  return useMemo<ColumnDef<StoreInventoryItemSchema>[]>(
    () => [
      {
        accessorKey: "sku_name",
        header: t("stores.inventory.columns.name"),
      },
      {
        accessorKey: "quantity",
        header: t("stores.inventory.columns.quantity"),
      },
      {
        id: "prices",
        header: t("stores.inventory.columns.prices"),
        cell({ row }) {
          return (
            <SKUPriceDisplay
              retail_price_1={Number(row.original.retail_price_1 ?? "0")}
              retail_price_2={Number(row.original.retail_price_2 ?? "0")}
              wholesale_price={null}
            />
          );
        },
      },
      {
        accessorKey: "closest_expiration_date",
        header: t("stores.inventory.columns.closestExpirationDate"),
        enableColumnFilter: false,
        enableGlobalFilter: false,
        cell({ row }) {
          return (
            <div className="text-muted-foreground font-mono">
              {row.original.closest_expiration_date
                ? new Date(
                    row.original.closest_expiration_date
                  ).toLocaleDateString()
                : t("common.n/a")}
            </div>
          );
        },
      },
    ],
    [t]
  );
};
