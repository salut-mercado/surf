import type { FirmsProducerReturnSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export const useColumns = (): ColumnDef<FirmsProducerReturnSchema>[] => {
  const { t } = useTranslation();
  return useMemo(
    () => [
      { accessorKey: "name", header: t("producers.columns.name") },
      { accessorKey: "nif", header: t("producers.columns.taxId") },
      {
        accessorKey: "minimum_stock",
        header: t("producers.columns.minimumStock"),
      },
      {
        id: "actions",
        size: 40,
        cell: ({ row }) => (
          <ActionRow id={row.original.id} text={t("producers.columns.view")} />
        ),
      },
    ] satisfies ColumnDef<FirmsProducerReturnSchema>[],
    [t]
  );
};

const ActionRow = memo(({ id, text }: { id: string; text: string }) => {
  return (
    <div className="flex justify-end">
      <Button asChild variant="ghost">
        <Link href={`~/producers/${id}`}>
          {text} <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
});
ActionRow.displayName = "ActionRow";
