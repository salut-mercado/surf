import { skipToken } from "@tanstack/react-query";
import { AlertCircleIcon, ChevronLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/hooks/api";
import { StoreViewSkeleton } from "./view-store.skeleton";

const ViewStorePage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = api.stores.useGetById(
    id ? { id } : skipToken
  );
  return (
    <DashboardPage>
      {isLoading && <StoreViewSkeleton />}
      {isError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Unable to load store.</AlertTitle>
          <AlertDescription>
            <p>{(error as Error)?.message ?? "Error"}</p>
          </AlertDescription>
        </Alert>
      )}
      {!isLoading && !isError && data && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button asChild size="icon-sm" variant="outline">
                  <Link href="~/">
                    <ChevronLeft className="size-4" />
                  </Link>
                </Button>
                <span className="text-xl font-semibold">{data.address}</span>
              </div>
              <CardDescription>{data.legalEntity}</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href={`/${id}/edit`}>Edit</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="font-medium break-all">{data.address}</div>
                <div className="text-sm text-muted-foreground">
                  Legal Entity
                </div>
                <div className="font-medium break-all">{data.legalEntity}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="font-medium">€{data.price.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Sales Area</div>
                <div className="font-medium">{data.salesArea} m²</div>
                <div className="text-sm text-muted-foreground">Total Area</div>
                <div className="font-medium">{data.totalArea} m²</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">First Sale</div>
                <div className="font-medium">{data.dateOfFirstSale}</div>
                <div className="text-sm text-muted-foreground">
                  Working Hours
                </div>
                <div className="font-medium">{data.workingHours}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">IP Address</div>
                <div className="font-medium">{data.ip}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">Cluster</div>
                <div className="font-medium">{data.claster}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Contact Info
                </div>
                <div className="font-medium">{data.contacts || "—"}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Assortment & Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Assortment Matrix
                </div>
                <div className="font-medium">
                  {data.assortmentMatrix || "—"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Service Provider
                </div>
                <div className="font-medium">{data.serviceProvider || "—"}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>Timestamps and IDs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">Store ID</div>
                <div className="font-medium break-all text-xs">{data.id}</div>
                <div className="text-sm text-muted-foreground">Updated</div>
                <div className="font-medium">
                  {new Date(data.updatedAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {!isLoading && !isError && !data && (
        <Card>
          <CardHeader>
            <CardTitle>Store not found</CardTitle>
            <CardDescription>The store may have been removed.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </DashboardPage>
  );
};

export default ViewStorePage;
