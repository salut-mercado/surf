import { skipToken } from "@tanstack/react-query";
import { AlertCircleIcon, FileScan, Plus } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "wouter";
import { DataTable } from "~/components/composite/data-table";
import { DashboardPage } from "~/components/dashboard-page";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";
import { getColumns, type InventoryItem } from "./components/inventory.columns";
import { useDataTable } from "~/components/composite/data-table/use-data-table";

const InventoryPage = () => {
  const { t } = useTranslation();
  const { id: storeId } = useParams<{ id: string }>();

  // Fetch warehouses
  const warehouses = api.warehouse.useGetAll(
    storeId ? { limit: 1000 } : skipToken
  );

  const firstWarehouse = useMemo(() => {
    if (!warehouses.data?.pages) return null;
    const allWarehouses = warehouses.data.pages.flatMap((page) => page.items);
    const storeWarehouses = allWarehouses.filter(
      (wh) => wh.store_id === storeId
    );
    return storeWarehouses[0] || null;
  }, [warehouses.data, storeId]);

  // Fetch all SKUs
  const skus = api.skus.useGetAll(storeId ? { limit: 1000 } : skipToken);

  const allSkus = useMemo(() => {
    if (!skus.data?.items) return [];
    return skus.data.items;
  }, [skus.data]);

  // Batch stock queries via hooks api
  const stockQueries = api.stockSKU.useGetManyForWarehouse(
    allSkus,
    firstWarehouse?.id
  );

  // Build inventory items with quantities
  const inventoryItems = useMemo<InventoryItem[]>(() => {
    return allSkus.map((sku, index) => {
      const q = stockQueries[index];
      const quantity = q?.data?.quantity ?? 0;
      return { sku, quantity, storeId };
    });
  }, [allSkus, stockQueries, storeId]);

  const isLoading =
    warehouses.isLoading ||
    skus.isLoading ||
    stockQueries.some((q) => q.isLoading);
  const hasError = warehouses.isError || skus.isError;

  const table = useDataTable({
    data: inventoryItems,
    columns: getColumns(t),
  });

  if (isLoading) {
    return (
      <DashboardPage>
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardPage>
    );
  }

  if (hasError) {
    return (
      <DashboardPage>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{t("stores.inventory.error")}</AlertTitle>
          <AlertDescription>
            {t("stores.inventory.errorLoading")}
          </AlertDescription>
        </Alert>
      </DashboardPage>
    );
  }

  if (!firstWarehouse) {
    return (
      <DashboardPage>
        <Alert>
          <AlertTitle>{t("stores.inventory.noWarehouse.title")}</AlertTitle>
          <AlertDescription>
            {t("stores.inventory.noWarehouse.description")}
          </AlertDescription>
        </Alert>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage>
      <div className="space-y-4">
        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled>
            <FileScan className="size-4 mr-2" />
            {t("stores.inventory.scanArrivalDoc")}
          </Button>
          <Button asChild>
            <Link href={`~/stores/${storeId}/inventory/create`}>
              <Plus className="size-4 mr-2" />
              {t("stores.inventory.manualAdd")}
            </Link>
          </Button>
        </div>

        <DataTable table={table} />
      </div>
    </DashboardPage>
  );
};

export default InventoryPage;
