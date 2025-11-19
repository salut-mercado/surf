import { OrderStatusEnum } from "@salut-mercado/octo-client";
import { useLocation, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { api } from "~/hooks/api";
import { CreateInflowForm } from "./components/create-inflow.form";

export const CreateInflowPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const createInflow = api.inflows.useCreate();
  const addSkuItems = api.inflows.useAddSkuItems();

  if (!id) {
    return <DashboardPage>No store id</DashboardPage>;
  }

  const handleSubmit = async (data: {
    supplier_id: string;
    items: Array<{
      sku_id: string;
      quantity: number;
      warehouse_id?: string;
    }>;
  }) => {
    try {
      // Step 1: Create inflow with CREATED status
      const created = await createInflow.mutateAsync({
        orderInflowScheme: {
          supplier_id: data.supplier_id,
          store_id: id,
          order_status: OrderStatusEnum.created,
        },
      });

      if (created?.data?.id) {
        // Step 2: Add SKU items
        await addSkuItems.mutateAsync({
          orderInflowId: created.data.id,
          items: data.items.map((item) => ({
            sku_id: item.sku_id,
            quantity: item.quantity,
            warehouse_id: item.warehouse_id || null,
          })),
        });

        // Navigate to inflows list
        setLocation(`~/stores/${id}/inflows`, { replace: true });
      }
    } catch (error) {
      console.error("Failed to create inflow:", error);
      // Error handling is done by the mutation state
    }
  };

  return (
    <DashboardPage>
      <CreateInflowForm
        onSubmit={handleSubmit}
        isSubmitting={createInflow.isPending || addSkuItems.isPending}
      />
    </DashboardPage>
  );
};
