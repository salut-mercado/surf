import { skipToken } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
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
  const { t } = useTranslation();
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
              <span className="text-xl font-semibold">{data.name}</span>
              <CardDescription>
                {t("producers.view.taxId")}: {data.nif}
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href={`/${id}/edit`}>{t("producers.view.edit")}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t("producers.view.sections.summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("producers.view.labels.producerId")}
                </div>
                <div className="font-medium break-all">{id}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("producers.view.sections.inventory")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("producers.view.labels.minimumStock")}
                </div>
                <div className="font-medium">{data.minimum_stock}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {t("producers.view.sections.otherInformation")}
                </CardTitle>
                <CardDescription>
                  {t("producers.view.descriptions.otherInformation")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t("producers.view.plannedSection")}
                </div>
                <div className="font-medium">
                  {t("producers.view.toBeAdded")}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {!isLoading && !isError && !data && (
        <Card>
          <CardHeader>
            <CardTitle>{t("producers.view.notFound.title")}</CardTitle>
            <CardDescription>
              {t("producers.view.notFound.description")}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </DashboardPage>
  );
};

export default ViewProducerPage;
