import type { SupplierReturnSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export const useColumns = (): ColumnDef<SupplierReturnSchema>[] => {
  const { t } = useTranslation();

  return useMemo(
    () => [
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
          <ActionRow id={row.original.id} text={t("suppliers.columns.view")} />
        ),
      },
    ],
    [t]
  );
};

const ActionRow = memo(({ id, text }: { id: string; text: string }) => {
  return (
    <div className="flex justify-end">
      <Button asChild variant="ghost">
        <Link href={`~/suppliers/${id}`}>
          {text} <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
});
ActionRow.displayName = "ActionRow";
