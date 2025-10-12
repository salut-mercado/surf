import { DashboardPage } from "~/components/dashboard-page";
import { api } from "~/hooks/api";
import { skipToken } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Link, useParams } from "wouter";

const ViewSkuPage = () => {
  const { id } = useParams();
  const sku = api.skus.useGetById(id ? { id } : skipToken);

  if (sku.isLoading) return <Skeleton className="h-10 w-full" />;
  if (sku.isError) return <div>Error</div>;
  if (!sku.data) return <div>SKU not found</div>;

  const s = sku.data;

  return (
    <DashboardPage>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">{s.name}</h1>
        <Button asChild>
          <Link href={`/${s.id}/edit`}>Edit</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><span className="font-medium">Supplier:</span> {s.supplierId}</div>
        <div><span className="font-medium">Producer:</span> {s.producerId}</div>
        <div><span className="font-medium">Category:</span> {s.categoryId}</div>
        <div><span className="font-medium">Unit:</span> {s.unitMeasurement}</div>
        <div><span className="font-medium">Shelf Life:</span> {s.shelfLifetime}</div>
        <div><span className="font-medium">Net Weight:</span> {s.netWeight}</div>
        <div><span className="font-medium">VAT %:</span> {s.vatPercent}</div>
        <div><span className="font-medium">Alcohol %:</span> {s.alcoholPercent}</div>
        <div><span className="font-medium">Natural Loss %:</span> {s.naturalLossPercent}</div>
        <div><span className="font-medium">Max on Checkout:</span> {s.maxOnCheckout}</div>
        <div className="md:col-span-2">
          <div className="font-medium mb-1">Specifications</div>
          <div className="whitespace-pre-wrap break-words">
            {s.specifications}
          </div>
        </div>
      </div>
    </DashboardPage>
  );
};

export default ViewSkuPage;


