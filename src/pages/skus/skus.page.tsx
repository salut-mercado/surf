import { Plus } from "lucide-react";
import { Link } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/hooks/api";
import { columns } from "./columns";
import { SkusEmptyState } from "./skus.empty-state";
import { SkusErrorState } from "./skus.error-state";
import { SkusSkeleton } from "./skus.skeleton";

export default function SkusPage() {
  const skus = api.skus.useGetAll({ limit: 1000 });
  const allSkus = skus.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <DashboardPage>
      {skus.isLoading && <SkusSkeleton />}
      {skus.isError && <SkusErrorState message={skus.error.message} />}
      {allSkus.length === 0 && <SkusEmptyState />}
      {skus.isSuccess && allSkus.length > 0 && (
        <>
          <div className="mb-2 justify-end flex w-full">
            <Button asChild>
              <Link href="/create">
                <Plus className="size-4" />
                Add SKU
              </Link>
            </Button>
          </div>
          <DataTable data={allSkus} columns={columns} />
        </>
      )}
    </DashboardPage>
  );
}
