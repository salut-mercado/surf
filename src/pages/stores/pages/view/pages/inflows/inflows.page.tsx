import { PlusIcon } from "lucide-react";
import { Link, useParams } from "wouter";
import { DataTable } from "~/components/composite/data-table";
import { useDataTable } from "~/components/composite/data-table/use-data-table";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { api } from "~/hooks/api";
import { useColumns } from "./use-columns";
import { useMemo } from "react";

export const InflowsPage = () => {
  const { id } = useParams<{ id: string }>();

  const inflows = api.inflows.useGetAll({
    limit: 1000,
  });

  const filteredInflows = useMemo(() => {
    return (
      inflows.data?.items?.filter((inflow) => inflow.store_id === id) ?? []
    );
  }, [inflows.data?.items, id]);

  const columns = useColumns(id);

  const table = useDataTable({
    data: filteredInflows,
    columns,
  });
  if (!id) {
    return <DashboardPage>No store id</DashboardPage>;
  }

  return (
    <DashboardPage>
      <div className="flex flex-col gap-4">
        {inflows.isLoading && (
          <div className="text-muted-foreground">Loading...</div>
        )}
        {inflows.isError && (
          <div className="text-destructive">
            Error: {inflows.error?.message}
          </div>
        )}
        {inflows.isSuccess && (
          <DataTable
            table={table}
            topExtra={
              <div className="ml-auto flex">
                <Button asChild>
                  <Link href={`~/stores/${id}/inflows/create`}>
                    <PlusIcon className="size-4" />
                    Create Inflow
                  </Link>
                </Button>
              </div>
            }
          />
        )}
      </div>
    </DashboardPage>
  );
};
