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
import { ProducersErrorState } from "../../producers.error-state";

const ViewProducerPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = api.producers.useGetById(
    id ? { id } : skipToken
  );
  return (
    <DashboardPage>
      {isLoading && <Skeleton className="h-10 w-full" />}
      {isError && <ProducersErrorState message={error.message} />}
      {!isLoading && !isError && data && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button asChild size="icon-sm" variant="outline">
                  <Link href="~/producers">
                    <ChevronLeft className="size-4" />
                  </Link>
                </Button>
                <span className="text-xl font-semibold">{data.name}</span>
                <Badge variant="secondary">Producer</Badge>
              </div>
              <CardDescription>Tax ID: {data.nif}</CardDescription>
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
                <div className="text-sm text-muted-foreground">Producer ID</div>
                <div className="font-medium break-all">{id}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Minimum Stock
                </div>
                <div className="font-medium">{data.minimumStock}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Other Information</CardTitle>
                <CardDescription>Additional metadata</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Planned section
                </div>
                <div className="font-medium">To be added</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {!isLoading && !isError && !data && (
        <Card>
          <CardHeader>
            <CardTitle>Producer not found</CardTitle>
            <CardDescription>
              The producer may have been removed.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </DashboardPage>
  );
};

export default ViewProducerPage;
