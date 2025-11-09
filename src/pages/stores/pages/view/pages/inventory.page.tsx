import { skipToken } from "@tanstack/react-query";
import { useParams } from "wouter";
import { DataTable } from "~/components/composite/data-table";
import { useDataTable } from "~/components/composite/data-table/use-data-table";
import { DashboardPage } from "~/components/dashboard-page";
import { Alert, AlertTitle } from "~/components/ui/alert";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";
import { useColumns } from "./use-columns";
import { AlertCircleIcon } from "lucide-react";

const InventoryPage = () => {
  const { id: storeId } = useParams<{ id: string }>();

  const inventory = api.inventory.useGetInventory(
    storeId ? { storeId } : skipToken
  );
  const columns = useColumns();
  const table = useDataTable({
    columns,
    data: inventory.data?.items ?? [],
  });

  if (inventory.isLoading) {
    return (
      <DashboardPage>
        <Skeleton className="h-full w-full" />
      </DashboardPage>
    );
  }

  if (inventory.isError) {
    return (
      <DashboardPage>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{inventory.error.message}</AlertTitle>
        </Alert>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage>
      <DataTable table={table} />
    </DashboardPage>
  );
};

export default InventoryPage;
