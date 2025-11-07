import { OrderStatusEnum } from "@salut-mercado/octo-client";
import { AlertCircleIcon, ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/hooks/api";

interface OrderItem {
  skuId: string;
  quantity: number;
}

const InventoryCreateInflowPage = () => {
  const { t } = useTranslation();
  const { id: storeId } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [supplierId, setSupplierId] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<OrderStatusEnum>(
    OrderStatusEnum.created
  );
  const [items, setItems] = useState<OrderItem[]>([{ skuId: "", quantity: 1 }]);
  const [error, setError] = useState<string | null>(null);

  const suppliers = api.suppliers.useGetAll({ limit: 1000 });
  const skus = api.skus.useGetAll({ limit: 1000 });
  const createInflow = api.inflows.useCreate();
  const addSkuItems = api.inflows.useAddSkuItems();
  const warehouses = api.warehouse.useGetAll({ limit: 1000 });
  const firstWarehouse = useMemo(() => {
    if (!warehouses.data?.pages) return null;
    const allWarehouses = warehouses.data.pages.flatMap((page) => page.items);
    const storeWarehouses = allWarehouses.filter(
      (wh) => wh.store_id === storeId
    );
    return storeWarehouses[0] || null;
  }, [warehouses.data, storeId]);

  const warehouseId = firstWarehouse?.id;

  const allSuppliers =
    suppliers.data?.pages.flatMap((page) => page.items) ?? [];
  const allSkus = skus.data?.items ?? [];

  const handleAddItem = () => {
    setItems([...items, { skuId: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supplierId) {
      setError(t("stores.inventory.createInflow.errorSelectSupplier"));
      return;
    }

    if (items.some((item) => !item.skuId || item.quantity <= 0)) {
      setError(t("stores.inventory.createInflow.errorFillItems"));
      return;
    }

    if (orderStatus === OrderStatusEnum.delivered && !warehouseId) {
      setError(t("stores.inventory.createInflow.errorWarehouseRequired"));
      return;
    }

    try {
      const result = await createInflow.mutateAsync({
        orderInflowScheme: {
          supplier_id: supplierId,
          store_id: storeId!,
          order_status: orderStatus as OrderStatusEnum,
        },
      });

      // After creating order, add SKU items
      if (result && items.length > 0) {
        try {
          await addSkuItems.mutateAsync({
            orderInflowId: result.data.id,
            items: items.map((item) => ({
              sku_id: item.skuId,
              quantity: item.quantity,
              orderStatus: orderStatus,
              ...(warehouseId && { warehouseId }),
            })),
          });
        } catch (err) {
          console.error("Failed to add SKU items:", err);
          setError(t("stores.inventory.createInflow.errorOrderCreated"));
          return;
        }
      }

      setLocation(`~/stores/${storeId}/inventory`, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("stores.inventory.createInflow.errorCreateFailed")
      );
    }
  };

  if (suppliers.isLoading || skus.isLoading) {
    return (
      <DashboardPage>
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button asChild size="icon-sm" variant="outline">
            <Link href={`~/stores/${storeId}/inventory`}>
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">
            {t("stores.inventory.createInflow.title")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("stores.inventory.createInflow.orderDetails")}
              </CardTitle>
              <CardDescription>
                {t("stores.inventory.createInflow.orderDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="supplier">
                  {t("stores.inventory.createInflow.supplier")}
                </Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger id="supplier">
                    <SelectValue
                      placeholder={t(
                        "stores.inventory.createInflow.selectSupplier"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {allSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">
                  {t("stores.inventory.createInflow.orderStatus")}
                </Label>
                <Select
                  value={orderStatus}
                  onValueChange={(value) =>
                    setOrderStatus(value as OrderStatusEnum)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREATED">
                      {t("stores.inventory.createInflow.statusCreated")}
                    </SelectItem>
                    <SelectItem value="SENT">
                      {t("stores.inventory.createInflow.statusSent")}
                    </SelectItem>
                    <SelectItem value="APPROVED">
                      {t("stores.inventory.createInflow.statusApproved")}
                    </SelectItem>
                    <SelectItem value="REJECTED">
                      {t("stores.inventory.createInflow.statusRejected")}
                    </SelectItem>
                    <SelectItem value="CHANGED">
                      {t("stores.inventory.createInflow.statusChanged")}
                    </SelectItem>
                    <SelectItem value="DELIVERED">
                      {t("stores.inventory.createInflow.statusDelivered")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("stores.inventory.createInflow.items")}</CardTitle>
              <CardDescription>
                {t("stores.inventory.createInflow.itemsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 grid gap-2">
                    <Label>{t("stores.inventory.createInflow.sku")}</Label>
                    <Select
                      value={item.skuId}
                      onValueChange={(value) =>
                        handleItemChange(index, "skuId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "stores.inventory.createInflow.selectSku"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {allSkus.map((sku) => (
                          <SelectItem key={sku.id} value={sku.id}>
                            {sku.name} ({sku.barcode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 grid gap-2">
                    <Label>{t("stores.inventory.createInflow.quantity")}</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                  >
                    {t("stores.inventory.createInflow.remove")}
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddItem}>
                {t("stores.inventory.createInflow.addItem")}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{t("stores.inventory.error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href={`~/stores/${storeId}/inventory`}>
                {t("stores.inventory.createInflow.cancel")}
              </Link>
            </Button>
            <Button type="submit" disabled={createInflow.isPending}>
              {createInflow.isPending ? (
                <>
                  <Spinner className="mr-2" />
                  {t("stores.inventory.createInflow.creating")}
                </>
              ) : (
                t("stores.inventory.createInflow.createOrder")
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardPage>
  );
};

export default InventoryCreateInflowPage;
