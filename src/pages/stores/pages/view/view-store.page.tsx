import { skipToken } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/hooks/api";
import { QuickActions } from "./components/quick-actions";
import { StoreHeader } from "./components/store-header";
import { StoreInfoGrid } from "./components/store-info-grid";
import { StoreOverview } from "./components/store-overview";
import { StoreViewSkeleton } from "./view-store.skeleton";
import { Separator } from "@radix-ui/react-separator";

const ViewStorePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data, isLoading, isError, error } = api.stores.useGetById(
    id ? { id } : skipToken
  );
  return (
    <DashboardPage key={id}>
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
        <div>
          <StoreHeader {...data} />
          <Separator className="my-6 h-1 w-full" orientation="horizontal" />
          <QuickActions {...data} />
          <StoreOverview {...data} />
          <StoreInfoGrid {...data} />
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
