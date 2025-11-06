import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export const useColumns = (): ColumnDef<SKUReturnSchema>[] => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<SKUReturnSchema>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("skus.columns.name"),
        filterFn: "includesString",
        enableColumnFilter: true,
      },
      { accessorKey: "unitMeasurement", header: t("skus.columns.unit") },
      { accessorKey: "netWeight", header: t("skus.columns.netWeight") },
      {
        id: "actions",
        size: 40,
        cell: ({ row }) => (
          <ActionRow id={row.original.id} text={t("skus.columns.view")} />
        ),
      },
    ],
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
