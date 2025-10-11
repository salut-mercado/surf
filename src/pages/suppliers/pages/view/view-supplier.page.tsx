import { skipToken } from "@tanstack/react-query";
import { useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";

const ViewSupplierPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = api.suppliers.useGetById(
    id ? { id } : skipToken
  );
  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (isError) return <div>Error</div>;
  return (
    <DashboardPage>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </DashboardPage>
  );
};

export default ViewSupplierPage;