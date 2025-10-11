import { Plus } from "lucide-react";
import { Link } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/hooks/api";
import { columns } from "./columns";
import { SuppliersEmptyState } from "./suppliers.empty-state";
import { SuppliersErrorState } from "./suppliers.error-state";
import { SuppliersSkeleton } from "./suppliers.skeleton";

export default function SuppliersPage() {
  const suppliers = api.suppliers.useGetAll({});
  const allSuppliers =
    suppliers.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <DashboardPage>
      {suppliers.isLoading && <SuppliersSkeleton />}
      {suppliers.isError && (
        <SuppliersErrorState message={suppliers.error.message} />
      )}
      {allSuppliers.length === 0 && <SuppliersEmptyState />}
      {suppliers.isSuccess && (
        <>
          <div className="mb-2 justify-end flex w-full">
            <Button asChild>
              <Link href="/create">
                <Plus className="size-4" />
                Add Supplier
              </Link>
            </Button>
          </div>
          <DataTable data={allSuppliers} columns={columns} />
        </>
      )}
    </DashboardPage>
  );
}
