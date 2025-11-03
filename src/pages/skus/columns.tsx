import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import type { TFunction } from "i18next";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export const getColumns = (
  t: TFunction
): ColumnDef<SKUReturnSchema>[] => [
  { accessorKey: "name", header: t("skus.columns.name") },
  { accessorKey: "unitMeasurement", header: t("skus.columns.unit") },
  { accessorKey: "netWeight", header: t("skus.columns.netWeight") },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="ghost">
          <Link href={`/${row.original.id}`}>
            {t("skus.columns.view")} <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];


