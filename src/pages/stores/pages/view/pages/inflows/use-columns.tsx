import type { OrderInflowBaseReturnScheme } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { OrderStatusEnum } from "@salut-mercado/octo-client";
import { api } from "~/hooks/api";

export const useColumns = (
  storeId: string
): ColumnDef<OrderInflowBaseReturnScheme>[] => {
  const { t } = useTranslation();
  const suppliers = api.suppliers.useGetAll({ limit: 1000 });

  const supplierMap = useMemo(() => {
    const map = new Map<string, string>();
    suppliers.data?.pages
      .flatMap((p) => p.items || [])
      .forEach((s) => {
        if (s && s.id) map.set(s.id, s.name);
      });
    return map;
  }, [suppliers.data]);

  return useMemo(
    () =>
      [
        {
          accessorKey: "id",
          header: t("inflows.columns.id"),
          cell: ({ row }) => (
            <div className="font-mono text-sm">{row.original.id.slice(0, 8)}</div>
          ),
        },
        {
          accessorKey: "supplier_id",
          header: t("inflows.columns.supplier"),
          cell: ({ row }) => {
            const supplierName =
              supplierMap.get(row.original.supplier_id) ||
              row.original.supplier_id;
            return <div>{supplierName}</div>;
          },
          enableColumnFilter: false,
        },
        {
          accessorKey: "order_status",
          header: t("inflows.columns.status"),
          cell: ({ row }) => {
            const status = row.original.order_status;
            const variant =
              status === OrderStatusEnum.approved
                ? "default"
                : status === OrderStatusEnum.created
                  ? "secondary"
                  : "outline";
            return (
              <Badge variant={variant}>
                {status}
              </Badge>
            );
          },
        },
        {
          id: "actions",
          size: 40,
          cell: ({ row }) => (
            <ActionRow
              id={row.original.id}
              storeId={storeId}
              text={t("inflows.columns.view")}
            />
          ),
        },
      ] satisfies ColumnDef<OrderInflowBaseReturnScheme>[],
    [t, storeId]
  );
};

const ActionRow = memo(
  ({ id, storeId, text }: { id: string; storeId: string; text: string }) => {
    return (
      <div className="flex justify-end">
        <Button asChild variant="ghost">
          <Link href={`~/stores/${storeId}/inflows/${id}`}>
            {text} <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }
);
ActionRow.displayName = "ActionRow";

