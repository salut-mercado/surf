import { skipToken } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";

const ViewSkuPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = api.skus.useGetById(
    id ? { id } : skipToken
  );

  return (
    <DashboardPage>
      {isLoading && <Skeleton className="h-10 w-full" />}
      {isError && <div>{(error as Error)?.message ?? "Error"}</div>}
      {!isLoading && !isError && data && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button asChild size="icon-sm" variant="outline">
                  <Link href="/">
                    <ChevronLeft className="size-4" />
                  </Link>
                </Button>
                <span className="text-xl font-semibold">{data.name}</span>
                <Badge variant="secondary">SKU</Badge>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href={`/${id}/edit`}>Edit</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">SKU ID</div>
                <div className="font-mono text-sm break-all">{data.id}</div>
                <div className="text-sm text-muted-foreground">Category</div>
                <div className="font-medium break-all">{data.categoryId}</div>
                <div className="text-sm text-muted-foreground">Supplier</div>
                <div className="font-medium break-all">{data.supplierId}</div>
                <div className="text-sm text-muted-foreground">Producer</div>
                <div className="font-medium break-all">{data.producerId}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Measurements and constraints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Unit</div>
                    <div className="font-medium">{data.unitMeasurement}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Shelf Life</div>
                    <div className="font-medium">{data.shelfLifetime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Net Weight</div>
                    <div className="font-medium">{data.netWeight}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">VAT %</div>
                    <div className="font-medium">{data.vatPercent}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Alcohol %</div>
                    <div className="font-medium">{data.alcoholPercent}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Natural Loss %
                    </div>
                    <div className="font-medium">{data.naturalLossPercent}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Max on Checkout
                    </div>
                    <div className="font-medium">{data.maxOnCheckout}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>Free-form attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-medium whitespace-pre-wrap break-words">
                  {data.specifications || "—"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {!isLoading && !isError && !data && (
        <Card>
          <CardHeader>
            <CardTitle>SKU not found</CardTitle>
            <CardDescription>The SKU may have been removed.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </DashboardPage>
  );
};

export default ViewSkuPage;


