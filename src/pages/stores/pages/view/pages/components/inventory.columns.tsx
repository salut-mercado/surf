import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export interface InventoryItem {
  sku: SKUReturnSchema;
  quantity: number;
  storeId: string;
}

export const getColumns = (
  t: TFunction
): ColumnDef<InventoryItem>[] => [
  {
    accessorFn: (row) => row.sku.name,
    id: "name",
    header: t("stores.inventory.columns.name"),
  },
  {
    accessorFn: (row) => row.sku.barcode,
    id: "barcode",
    header: t("stores.inventory.columns.barcode"),
  },
  {
    accessorKey: "quantity",
    header: t("stores.inventory.columns.quantity"),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.quantity}</div>
    ),
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Link
            asChild
            href={`~/stores/${row.original.storeId}/inventory/${row.original.sku.id}`}
          >
            <Button
              variant="ghost"
              size="sm"
              disabled={row.original.quantity <= 0}
            >
              {t("stores.inventory.columns.view")} <ChevronRight className="size-4 ml-1" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
