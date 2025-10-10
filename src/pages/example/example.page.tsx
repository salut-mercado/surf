import { Skeleton } from "~/components/ui/skeleton";
import { useSupplier } from "./use-supplier";
import { CreateSupplier } from "./create-supplier";

export default function ExamplePage() {
  const { data, isLoading, isError } = useSupplier({ limit: 100 });
  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (isError) return <div>Error</div>;
  return (
    <div>
      <CreateSupplier />
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
