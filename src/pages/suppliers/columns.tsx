import type { SupplierReturnSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import type { TFunction } from "i18next";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export const getColumns = (
  t: TFunction
): ColumnDef<SupplierReturnSchema>[] => [
  { accessorKey: "code", header: t("suppliers.columns.code") },
  { accessorKey: "name", header: t("suppliers.columns.name") },
  { accessorKey: "agent", header: t("suppliers.columns.agent") },
  { accessorKey: "phone", header: t("suppliers.columns.phone") },
  { accessorKey: "nif", header: t("suppliers.columns.taxId") },
  { accessorKey: "delayDays", header: t("suppliers.columns.delayDays") },
  { accessorKey: "blocked", header: t("suppliers.columns.blocked") },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="ghost">
          <Link href={`/${row.original.id}`}>
            {t("suppliers.columns.view")} <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];
