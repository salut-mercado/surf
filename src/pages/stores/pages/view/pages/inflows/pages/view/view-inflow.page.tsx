import { OrderStatusEnum } from "@salut-mercado/octo-client";
import { skipToken } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";

export const ViewInflowPage = () => {
  const { id: storeId, inflowId } = useParams<{
    id?: string;
    inflowId?: string;
  }>();

  const inflow = api.inflows.useGetById(
    inflowId ? { id: inflowId } : skipToken
  );
  const suppliers = api.suppliers.useGetAll({ limit: 1000 });

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

  const isApproved = inflowData.order_status === OrderStatusEnum.approved;
  const canEdit = !isApproved;

  const supplierName =
    suppliers.data?.pages
      .flatMap((p) => p.items || [])
      .find((s) => s.id === inflowData.supplier_id)?.name ||
    inflowData.supplier_id;

  return (
    <DashboardPage>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inflow Details</h1>
            <p className="text-muted-foreground text-sm">
              ID: {inflowData.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <Button asChild>
                <Link href={`~/stores/${storeId}/inflows/${inflowId}/edit`}>
                  Edit
                </Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href={`~/stores/${storeId}/inflows`}>Back</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Supplier</Label>
            <div className="text-muted-foreground">{supplierName}</div>
          </div>
          <div className="space-y-2">
            <Label>Store ID</Label>
            <div className="text-muted-foreground">{inflowData.store_id}</div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <div>
              <Badge
                variant={
                  isApproved
                    ? "default"
                    : inflowData.order_status === OrderStatusEnum.created
                      ? "secondary"
                      : "outline"
                }
              >
                {inflowData.order_status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium">{children}</div>
);
