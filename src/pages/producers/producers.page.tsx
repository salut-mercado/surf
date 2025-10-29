import { Plus } from "lucide-react";
import { Link } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/hooks/api";
import { columns } from "./columns";
import { ProducersEmptyState } from "./producers.empty-state";
import { ProducersErrorState } from "./producers.error-state";
import { ProducersSkeleton } from "./producers.skeleton";

export default function ProducersPage() {
  const producers = api.producers.useGetAll({ limit: 1000 });
  const items = producers.data ?? [];

  return (
    <DashboardPage>
      {producers.isLoading && <ProducersSkeleton />}
      {producers.isError && (
        <ProducersErrorState message={producers.error.message} />
      )}
      {items.length === 0 && <ProducersEmptyState />}
      {producers.isSuccess && items.length > 0 && (
        <>
          <div className="mb-2 justify-end flex w-full">
            <Button asChild>
              <Link href="/create">
                <Plus className="size-4" />
                Add Producer
              </Link>
            </Button>
          </div>
          <DataTable data={items} columns={columns} />
        </>
      )}
    </DashboardPage>
  );
}
