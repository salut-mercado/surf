import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { DataTable } from "~/components/composite/data-table";
import { useDataTable } from "~/components/composite/data-table/use-data-table";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { api } from "~/hooks/api";
import { useColumns } from "./use-columns";
import { ProducersEmptyState } from "./producers.empty-state";
import { ProducersErrorState } from "./producers.error-state";
import { ProducersSkeleton } from "./producers.skeleton";

export default function ProducersPage() {
  const { t } = useTranslation();
  const producers = api.producers.useGetAll({ limit: 1000 });
  const items = useMemo(() => producers.data ?? [], [producers.data]);
  const columns = useColumns();

  const table = useDataTable({
    data: items,
    columns,
  });

  return (
    <DashboardPage>
      {producers.isLoading && <ProducersSkeleton />}
      {producers.isError && (
        <ProducersErrorState message={producers.error.message} />
      )}
      {items.length === 0 && !producers.isLoading && <ProducersEmptyState />}
      {producers.isSuccess && items.length > 0 && (
        <>
          <DataTable
            table={table}
            topExtra={
              <div className="ml-auto flex">
                <Button asChild>
                  <Link href="/create">
                    <Plus className="size-4" />
                    {t("producers.addProducer")}
                  </Link>
                </Button>
              </div>
            }
          />
        </>
      )}
    </DashboardPage>
  );
}
