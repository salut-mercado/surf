import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export interface InventoryItem {
  sku: SKUReturnSchema;
  quantity: number;
  storeId: string;
}

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorFn: (row) => row.sku.name,
    id: "name",
    header: "Name",
  },
  {
    accessorFn: (row) => row.sku.barcode,
    id: "barcode",
    header: "Barcode",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
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
              View <ChevronRight className="size-4 ml-1" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
