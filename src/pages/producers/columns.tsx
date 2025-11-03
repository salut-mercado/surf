import type { FirmsProducerSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import type { TFunction } from "i18next";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export const getColumns = (
  t: TFunction
): ColumnDef<FirmsProducerSchema & { id: string }>[] => [
  { accessorKey: "name", header: t("producers.columns.name") },
  { accessorKey: "nif", header: t("producers.columns.taxId") },
  { accessorKey: "minimumStock", header: t("producers.columns.minimumStock") },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="ghost">
          <Link href={`/${row.original.id}`}>
            {t("producers.columns.view")} <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];
