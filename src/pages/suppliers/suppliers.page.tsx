import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { DataTable } from "~/components/composite/data-table";
import { useDataTable } from "~/components/composite/data-table/use-data-table";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { api } from "~/hooks/api";
import { SuppliersEmptyState } from "./suppliers.empty-state";
import { SuppliersErrorState } from "./suppliers.error-state";
import { SuppliersSkeleton } from "./suppliers.skeleton";
import { useColumns } from "./use-columns";

export default function SuppliersPage() {
  const { t } = useTranslation();
  const suppliers = api.suppliers.useGetAll({ limit: 1000 });
  const columns = useColumns();
  const allSuppliers = useMemo(
    () => suppliers.data?.pages.flatMap((page) => page.items) ?? [],
    [suppliers.data]
  );

  const table = useDataTable({
    data: allSuppliers,
    columns,
  });

  return (
    <DashboardPage>
      {suppliers.isLoading && <SuppliersSkeleton />}
      {suppliers.isError && (
        <SuppliersErrorState message={suppliers.error.message} />
      )}
      {allSuppliers.length === 0 && !suppliers.isLoading && (
        <SuppliersEmptyState />
      )}
      {suppliers.isSuccess && allSuppliers.length > 0 && (
        <>
          <div className="mb-2 justify-end flex w-full">
            <Button asChild>
              <Link href="/create">
                <Plus className="size-4" />
                {t("suppliers.addSupplier")}
              </Link>
            </Button>
          </div>
          <DataTable table={table} />
        </>
      )}
    </DashboardPage>
  );
}
