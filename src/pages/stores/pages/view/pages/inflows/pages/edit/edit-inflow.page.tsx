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

  const handleSubmit = async () => {
    try {
      await updateInflow.mutateAsync({
        id: inflowId,
        orderInflowUpdateScheme: {
          status: OrderStatusEnum.approved,
        },
      });
      setLocation(`~/stores/${storeId}/inflows/${inflowId}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Failed to update inflow:", error);
    }
  };

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
          isSubmitting={updateInflow.isPending}
        />
      </div>
    </DashboardPage>
  );
};

