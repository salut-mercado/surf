import { skipToken } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/hooks/api";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import type { OrderStatusEnum } from "@salut-mercado/octo-client";

interface OrderItem {
  skuId: string;
  quantity: number;
}

const InventoryCreateInflowPage = () => {
  const { id: storeId } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [supplierId, setSupplierId] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<OrderStatusEnum>("CREATED");
  const [items, setItems] = useState<OrderItem[]>([{ skuId: "", quantity: 1 }]);
  const [error, setError] = useState<string | null>(null);

  const suppliers = api.suppliers.useGetAll({ limit: 1000 });
  const skus = api.skus.useGetAll({ limit: 1000 });
  const createInflow = api.inflows.useCreate();
  const addSkuItems = api.inflows.useAddSkuItems();

  const allSuppliers = suppliers.data?.pages.flatMap((page) => page.items) ?? [];
  const allSkus = skus.data?.pages.flatMap((page) => page.items) ?? [];

  const handleAddItem = () => {
    setItems([...items, { skuId: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supplierId) {
      setError("Please select a supplier");
      return;
    }

    if (items.some((item) => !item.skuId || item.quantity <= 0)) {
      setError("Please fill in all items with valid quantities");
      return;
    }

    try {
      const result = await createInflow.mutateAsync({
        orderInflowScheme: {
          supplierId: supplierId,
          storeId: storeId!,
          orderStatus: orderStatus as OrderStatusEnum,
        },
      });

      // After creating order, add SKU items
      if (result && items.length > 0) {
        try {
          await addSkuItems.mutateAsync({
            orderInflowId: result.id,
            items: items.map((item) => ({
              skuId: item.skuId,
              quantity: item.quantity,
            })),
          });
        } catch (err) {
          console.error("Failed to add SKU items:", err);
          setError("Order created but failed to add items. Please try again.");
          return;
        }
      }

      setLocation(`/${storeId}/inventory`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order inflow");
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
            <Link href={`/${storeId}/inventory`}>
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Create Order Inflow</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>
                Create a new order inflow for this store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Select a supplier" />
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
                <Label htmlFor="status">Order Status</Label>
                <Select
                  value={orderStatus}
                  onValueChange={(value) => setOrderStatus(value as OrderStatusEnum)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREATED">Created</SelectItem>
                    <SelectItem value="SENT">Sent</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="CHANGED">Changed</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>Add SKUs to this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 grid gap-2">
                    <Label>SKU</Label>
                    <Select
                      value={item.skuId}
                      onValueChange={(value) =>
                        handleItemChange(index, "skuId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SKU" />
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
                    <Label>Quantity</Label>
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
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddItem}>
                Add Item
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <Link href={`/${storeId}/inventory`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={createInflow.isPending}>
              {createInflow.isPending ? (
                <>
                  <Spinner className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Order"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardPage>
  );
};

export default InventoryCreateInflowPage;
