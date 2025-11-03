import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/hooks/api";
import { getColumns } from "./columns";
import { SuppliersEmptyState } from "./suppliers.empty-state";
import { SuppliersErrorState } from "./suppliers.error-state";
import { SuppliersSkeleton } from "./suppliers.skeleton";

export default function SuppliersPage() {
  const { t } = useTranslation();
  const suppliers = api.suppliers.useGetAll({ limit: 1000 });
  const allSuppliers =
    suppliers.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <DashboardPage>
      {suppliers.isLoading && <SuppliersSkeleton />}
      {suppliers.isError && (
        <SuppliersErrorState message={suppliers.error.message} />
      )}
      {allSuppliers.length === 0 && !suppliers.isLoading && <SuppliersEmptyState />}
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
          <DataTable data={allSuppliers} columns={getColumns(t)} />
        </>
      )}
    </DashboardPage>
  );
}
