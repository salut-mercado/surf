import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Link } from "wouter";
import { DataTable } from "~/components/composite/data-table";
import { useDataTable } from "~/components/composite/data-table/use-data-table";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { api } from "~/hooks/api";
import { SkusEmptyState } from "./skus.empty-state";
import { SkusErrorState } from "./skus.error-state";
import { SkusSkeleton } from "./skus.skeleton";
import { useColumns } from "./use-columns";

export default function SkusPage() {
  const { t } = useTranslation();
  const skus = api.skus.useGetAll({ limit: 1000 });
  const columns = useColumns();
  const allSkus = useMemo(() => skus.data?.items ?? [], [skus.data]);

  const table = useDataTable({
    data: allSkus,
    columns,
  });

  return (
    <DashboardPage>
      {skus.isLoading && <SkusSkeleton />}
      {skus.isError && <SkusErrorState message={skus.error.message} />}
      {allSkus.length === 0 && !skus.isLoading && <SkusEmptyState />}
      {skus.isSuccess && allSkus.length > 0 && (
        <>
          <DataTable
            table={table}
            topExtra={
              <div className="ml-auto flex">
                <Button asChild>
                  <Link href="/create">
                    <Plus className="size-4" />
                    {t("skus.addSku")}
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
