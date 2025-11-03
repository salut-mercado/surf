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
        <SuppliersErrorState message={(error as Error)?.message ?? t("suppliers.view.error")} />
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
                  <Badge variant="destructive">{t("suppliers.view.blocked")}</Badge>
                ) : (
                  <Badge variant="secondary">{t("suppliers.view.active")}</Badge>
                )}
              </div>
              <CardDescription>{t("suppliers.view.code")}: {data.code}</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href={`/${id}/edit`}>{t("suppliers.view.edit")}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t("suppliers.view.sections.summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">{t("suppliers.view.labels.supplierId")}</div>
                <div className="font-medium break-all">{data.id}</div>
                <div className="text-sm text-muted-foreground">{t("suppliers.view.labels.updated")}</div>
                <div className="font-medium">
                  {data.updatedAt.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("suppliers.view.sections.contact")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">{t("suppliers.view.labels.agent")}</div>
                <div className="font-medium">{data.agent || t("common.n/a")}</div>
                <div className="text-sm text-muted-foreground">{t("suppliers.view.labels.phone")}</div>
                <div className="font-medium">{data.phone || t("common.n/a")}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("suppliers.view.sections.paymentTerms")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">{t("suppliers.view.labels.delayDays")}</div>
                <div className="font-medium">{data.delayDays} {t("suppliers.view.labels.days")}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t("suppliers.view.sections.notes")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">{t("suppliers.view.labels.comments")}</div>
                <div className="font-medium whitespace-pre-wrap">
                  {data.comments || t("suppliers.view.labels.noComments")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("suppliers.view.sections.tax")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">{t("suppliers.view.labels.nifVat")}</div>
                <div className="font-medium">{data.nif || t("common.n/a")}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t("suppliers.view.sections.banking")}</CardTitle>
                <CardDescription>
                  {t("suppliers.view.descriptions.banking")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("suppliers.view.plannedSection")}
                </div>
                <div className="font-medium">{t("suppliers.view.toBeAdded")}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("suppliers.view.sections.otherInformation")}</CardTitle>
                <CardDescription>{t("suppliers.view.descriptions.otherInformation")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("suppliers.view.plannedSection")}
                </div>
                <div className="font-medium">{t("suppliers.view.toBeAdded")}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {!isLoading && !isError && !data && (
        <Card>
          <CardHeader>
            <CardTitle>{t("suppliers.view.notFound.title")}</CardTitle>
            <CardDescription>
              {t("suppliers.view.notFound.description")}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </DashboardPage>
  );
};

export default ViewSupplierPage;
