import { skipToken } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
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
import { api } from "~/hooks/api";
import { SuppliersErrorState } from "../../suppliers.error-state";
import { SupplierViewSkeleton } from "./view-supplier.skeleton";
import { ChevronLeft } from "lucide-react";

const ViewSupplierPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data, isLoading, isError, error } = api.suppliers.useGetById(
    id ? { id } : skipToken
  );
  return (
    <DashboardPage>
      {isLoading && <SupplierViewSkeleton />}
      {isError && (
        <SuppliersErrorState message={(error as Error)?.message ?? "Error"} />
      )}
      {!isLoading && !isError && data && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button asChild size="icon-sm" variant="outline">
                  <Link href="~/suppliers">
                    <ChevronLeft className="size-4" />
                  </Link>
                </Button>
                <span className="text-xl font-semibold">{data.name}</span>
                {data.blocked ? (
                  <Badge variant="destructive">Blocked</Badge>
                ) : (
                  <Badge variant="secondary">Active</Badge>
                )}
              </div>
              <CardDescription>Code: {data.code}</CardDescription>
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
                <div className="text-sm text-muted-foreground">Supplier ID</div>
                <div className="font-medium break-all">{data.id}</div>
                <div className="text-sm text-muted-foreground">Updated</div>
                <div className="font-medium">
                  {data.updatedAt.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">Agent</div>
                <div className="font-medium">{data.agent || "—"}</div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">{data.phone || "—"}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">Delay Days</div>
                <div className="font-medium">{data.delayDays} days</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">Comments</div>
                <div className="font-medium whitespace-pre-wrap">
                  {data.comments || "No comments"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">NIF / VAT</div>
                <div className="font-medium">{data.nif || "—"}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Banking</CardTitle>
                <CardDescription>
                  Bank details and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Planned section
                </div>
                <div className="font-medium">To be added</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other Information</CardTitle>
                <CardDescription>Additional metadata and flags</CardDescription>
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
            <CardTitle>Supplier not found</CardTitle>
            <CardDescription>
              The supplier may have been removed.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </DashboardPage>
  );
};

export default ViewSupplierPage;
