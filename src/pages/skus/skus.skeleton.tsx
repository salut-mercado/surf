import { Skeleton } from "~/components/ui/skeleton";

export const SkusSkeleton = () => {
  return (
    <div className="space-y-2">
      <div className="flex flex-row-reverse">
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
};
