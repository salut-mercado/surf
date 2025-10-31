import { skipToken } from "@tanstack/react-query";
import { AlertCircleIcon, FileScan, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";
import { columns, type InventoryItem } from "./components/inventory.columns";

const InventoryPage = () => {
  const { id: storeId } = useParams<{ id: string }>();

  // Fetch warehouses
  const warehouses = api.warehouse.useGetAll(
    storeId ? { limit: 1000 } : skipToken
  );

  const firstWarehouse = useMemo(() => {
    if (!warehouses.data?.pages) return null;
    const allWarehouses = warehouses.data.pages.flatMap((page) => page.items);
    const storeWarehouses = allWarehouses.filter(
      (wh) => wh.storeId === storeId
    );
    return storeWarehouses[0] || null;
  }, [warehouses.data, storeId]);

  // Fetch all SKUs
  const skus = api.skus.useGetAll(storeId ? { limit: 1000 } : skipToken);

  const allSkus = useMemo(() => {
    if (!skus.data?.pages) return [];
    return skus.data.pages.flatMap((page) => page.items);
  }, [skus.data]);

  // Fetch all pages of SKUs
  useEffect(() => {
    if (skus.hasNextPage && !skus.isFetchingNextPage) {
      skus.fetchNextPage();
    }
  }, [skus.hasNextPage, skus.isFetchingNextPage, skus]);

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
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load inventory data. Please try again.
          </AlertDescription>
        </Alert>
      </DashboardPage>
    );
  }

  if (!firstWarehouse) {
    return (
      <DashboardPage>
        <Alert>
          <AlertTitle>No Warehouse</AlertTitle>
          <AlertDescription>
            No warehouse found for this store. Please create a warehouse first.
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
            Scan arrival doc
          </Button>
          <Button asChild>
            <Link href={`~/stores/${storeId}/inventory/create`}>
              <Plus className="size-4 mr-2" />
              Manual add
            </Link>
          </Button>
        </div>

        <DataTable data={inventoryItems} columns={columns} />
      </div>
    </DashboardPage>
  );
};

export default InventoryPage;
