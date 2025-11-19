import { OrderStatusEnum } from "@salut-mercado/octo-client";
import { skipToken } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";
import { EditInflowForm } from "./components/edit-inflow.form";

export const EditInflowPage = () => {
  const { id: storeId, inflowId } = useParams<{
    id?: string;
    inflowId?: string;
  }>();
  const [, setLocation] = useLocation();

  const inflow = api.inflows.useGetById(
    inflowId ? { id: inflowId } : skipToken
  );
  const suppliers = api.suppliers.useGetAll({ limit: 1000 });
  const updateInflow = api.inflows.useUpdate();
  const addSkuItems = api.inflows.useAddSkuItems();

  if (!storeId || !inflowId) {
    return <DashboardPage>Missing parameters</DashboardPage>;
  }

  if (inflow.isLoading) {
    return (
      <DashboardPage>
        <Skeleton className="h-10 w-full" />
      </DashboardPage>
    );
  }

  if (inflow.isError || !inflow.data) {
    return <DashboardPage>Error loading inflow</DashboardPage>;
  }

  const inflowData = inflow.data.items?.[0];
  if (!inflowData) {
    return <DashboardPage>Inflow not found</DashboardPage>;
  }

  const supplierName =
    suppliers.data?.pages
      .flatMap((p) => p.items || [])
      .find((s) => s.id === inflowData.supplier_id)?.name ||
    inflowData.supplier_id;

  const isCreated = inflowData.order_status === OrderStatusEnum.created;

  const handleSubmit = async (data?: {
    items: Array<{ sku_id: string; quantity: number; warehouse_id?: string }>;
    approve?: boolean;
  }) => {
    try {
      if (isCreated && data?.items) {
        // Handle item updates for CREATED status
        const originalItems = inflowData.sku_order_inflow || [];
        const newItems = data.items;

        // // Find items to delete (in original but not in new)
        // const itemsToDelete = originalItems.filter(
        //   (original) => !newItems.some((newItem) => newItem.sku_id === original.sku_id)
        // );

        // // Delete removed items
        // for (const item of itemsToDelete) {
        //   await deleteSkuItem.mutateAsync({
        //     orderInflowId: inflowId,
        //     skuId: item.sku_id,
        //   });
        // }

        // For items that exist in both, calculate quantity difference
        const itemsToAdd: Array<{
          sku_id: string;
          quantity: number;
          warehouse_id?: string;
        }> = [];

        for (const newItem of newItems) {
          const originalItem = originalItems.find(
            (orig) => orig.sku_id === newItem.sku_id
          );

          if (originalItem) {
            // // Item exists - check if quantity changed
            // const quantityDiff = newItem.quantity - (originalItem.quantity || 0);
            // if (quantityDiff !== 0) {
            //   // If quantity changed significantly, delete and re-add
            //   // Otherwise, we could use add/subtract APIs, but for simplicity, delete and re-add
            //   await deleteSkuItem.mutateAsync({
            //     orderInflowId: inflowId,
            //     skuId: originalItem.sku_id,
            //   });
            //   itemsToAdd.push({
            //     sku_id: newItem.sku_id,
            //     quantity: newItem.quantity,
            //     warehouse_id: newItem.warehouse_id,
            //   });
            // }
          } else {
            // New item
            itemsToAdd.push({
              sku_id: newItem.sku_id,
              quantity: newItem.quantity,
              warehouse_id: newItem.warehouse_id,
            });
          }
        }

        // Add new/updated items
        if (itemsToAdd.length > 0) {
          await addSkuItems.mutateAsync({
            orderInflowId: inflowId,
            items: itemsToAdd.map((item) => ({
              sku_id: item.sku_id,
              quantity: item.quantity,
              warehouse_id: item.warehouse_id || null,
            })),
          });
        }
      }
      if (data?.approve) {
        // Just update status to approved
        await updateInflow.mutateAsync({
          id: inflowId,
          orderInflowUpdateScheme: {
            status: OrderStatusEnum.approved,
          },
        });
      }

      setLocation(`~/stores/${storeId}/inflows/${inflowId}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Failed to update inflow:", error);
    }
  };

  const isSubmitting = updateInflow.isPending || addSkuItems.isPending;

  return (
    <DashboardPage>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Inflow</h1>
            <p className="text-muted-foreground text-sm">
              ID: {inflowData.id.slice(0, 8)}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`~/stores/${storeId}/inflows/${inflowId}`}>Back</Link>
          </Button>
        </div>
        <EditInflowForm
          inflow={inflowData}
          supplierName={supplierName}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardPage>
  );
};
