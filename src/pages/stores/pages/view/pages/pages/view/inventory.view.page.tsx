import { skipToken } from "@tanstack/react-query";
import { ChevronLeft, AlertCircleIcon } from "lucide-react";
import { Link, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";

const InventoryViewPage = () => {
  const { id: storeId, skuId } = useParams<{ id: string; skuId: string }>();

  const sku = api.skus.useGetById(
    skuId ? { id: skuId } : skipToken
  );

  // Fetch warehouses for this store
  const warehouses = api.warehouse.useGetAll(
    storeId ? { limit: 1000 } : skipToken
  );

  const firstWarehouse = warehouses.data?.pages
    ?.flatMap((page) => page.items)
    .find((wh) => wh.storeId === storeId);

  // Fetch stock quantity
  const stockQuery = api.stockSKU.useGetStockSku(
    firstWarehouse && sku.data?.barcode
      ? {
          barcode: sku.data.barcode,
          warehouseId: firstWarehouse.id,
        }
      : skipToken
  );

  const quantity = stockQuery.data?.quantity ?? 0;

  const isLoading = sku.isLoading || warehouses.isLoading || stockQuery.isLoading;
  const hasError = sku.isError || warehouses.isError || (stockQuery.error && (stockQuery.error as { status?: number }).status !== 404);

  if (isLoading) {
    return (
      <DashboardPage>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
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
            Failed to load inventory entry. Please try again.
          </AlertDescription>
        </Alert>
      </DashboardPage>
    );
  }

  if (!sku.data) {
    return (
      <DashboardPage>
        <Alert>
          <AlertTitle>SKU not found</AlertTitle>
          <AlertDescription>
            The inventory entry may have been removed.
          </AlertDescription>
        </Alert>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button asChild size="icon-sm" variant="outline">
                <Link href={`~/stores/${storeId}/inventory`}>
                  <ChevronLeft className="size-4" />
                </Link>
              </Button>
              <span className="text-xl font-semibold">{sku.data.name}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">Quantity</div>
              <div className="font-medium text-2xl">{quantity}</div>
              {firstWarehouse && (
                <>
                  <div className="text-sm text-muted-foreground">Warehouse</div>
                  <div className="font-medium break-all">
                    {firstWarehouse.address}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SKU Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">SKU ID</div>
              <div className="font-mono text-sm break-all">{sku.data.id}</div>
              <div className="text-sm text-muted-foreground">Barcode</div>
              <div className="font-medium break-all">{sku.data.barcode}</div>
              <div className="text-sm text-muted-foreground">Unit</div>
              <div className="font-medium">{sku.data.unitMeasurement}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium break-all">{sku.data.name}</div>
              {sku.data.netWeight && (
                <>
                  <div className="text-sm text-muted-foreground">Net Weight</div>
                  <div className="font-medium">{sku.data.netWeight}</div>
                </>
              )}
              {sku.data.shelfLifetime && (
                <>
                  <div className="text-sm text-muted-foreground">
                    Shelf Lifetime
                  </div>
                  <div className="font-medium">{sku.data.shelfLifetime} days</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPage>
  );
};

export default InventoryViewPage;
