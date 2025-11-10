import { skipToken } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { Separator } from "~/components/ui/separator";
import { api } from "~/hooks/api";
import { ActionRow } from "./components/action-row";
import { StoreViewSkeleton } from "./view-store.skeleton";

const ViewStorePage = () => {
  const { t } = useTranslation();
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
          <AlertTitle>{t("stores.view.errorLoading")}</AlertTitle>
          <AlertDescription>
            <p>{(error as Error)?.message ?? t("stores.view.error")}</p>
          </AlertDescription>
        </Alert>
      )}
      {!isLoading && !isError && data && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xl font-semibold">{data.address}</span>
              <CardDescription>{data.legal_entity}</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href={`/${id}/edit`}>{t("stores.view.edit")}</Link>
            </Button>
          </div>
          <ActionRow id={data.id} />
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t("stores.view.sections.location")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.address")}
                </div>
                <div className="font-medium break-all">{data.address}</div>
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.legalEntity")}
                </div>
                <div className="font-medium break-all">{data.legal_entity}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t("stores.view.sections.businessMetrics")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.price")}
                </div>
                <div className="font-medium">€{data.price.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.salesArea")}
                </div>
                <div className="font-medium">{data.sales_area} m²</div>
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.totalArea")}
                </div>
                <div className="font-medium">{data.total_area} m²</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("stores.view.sections.operations")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.firstSale")}
                </div>
                <div className="font-medium">{data.date_of_first_sale}</div>
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.workingHours")}
                </div>
                <div className="font-medium">{data.working_hours}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("stores.view.sections.network")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.ipAddress")}
                </div>
                <div className="font-medium">{data.ip}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t("stores.view.sections.classification")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.cluster")}
                </div>
                <div className="font-medium">{data.claster}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("stores.view.sections.contacts")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.contactInfo")}
                </div>
                <div className="font-medium">{data.contacts || "—"}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {t("stores.view.sections.assortmentService")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.assortmentMatrix")}
                </div>
                <div className="font-medium">
                  {data.assortment_matrix || "—"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.serviceProvider")}
                </div>
                <div className="font-medium">
                  {data.service_provider || "—"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("stores.view.sections.metadata")}</CardTitle>
                <CardDescription>
                  {t("stores.view.labels.timestampsAndIds")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.storeId")}
                </div>
                <div className="font-medium break-all text-xs">{data.id}</div>
                <div className="text-sm text-muted-foreground">
                  {t("stores.view.labels.updated")}
                </div>
                <div className="font-medium">
                  {new Date(data.updated_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {!isLoading && !isError && !data && (
        <Card>
          <CardHeader>
            <CardTitle>{t("stores.view.notFound.title")}</CardTitle>
            <CardDescription>
              {t("stores.view.notFound.description")}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </DashboardPage>
  );
};

export default ViewStorePage;
