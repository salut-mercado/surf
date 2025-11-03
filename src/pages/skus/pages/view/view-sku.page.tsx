import { Separator } from "@radix-ui/react-separator";
import { skipToken } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/hooks/api";
import { ActionRow } from "./components/action-row";
import { FinancialInfo } from "./components/financial-info";
import { Specifications } from "./components/specifications";
import { ViewSkuSkeleton } from "./view-sku.skeleton";
import { ProductInfo } from "./components/product-info";
import { AdditionalDetails } from "./components/additional-details";

const ViewSkuPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data, isLoading, isError, error } = api.skus.useGetById(
    id ? { id } : skipToken
  );

  return (
    <DashboardPage>
      {isLoading && <ViewSkuSkeleton />}
      {isError && (
        <div>{(error as Error)?.message ?? t("skus.view.error")}</div>
      )}
      {data && (
        <div className="space-y-2">
          <ActionRow sku={data} />
          <Separator className="my-6" />
          <div className="grid lg:grid-cols-5 gap-4">
            <ProductInfo sku={data} className="lg:col-span-3" />
            <FinancialInfo sku={data} className="lg:col-span-2" />
            <Specifications sku={data} className="lg:col-span-3" />
            <AdditionalDetails sku={data} className="lg:col-span-2" />
          </div>
        </div>
      )}
      {!isLoading && !isError && !data && (
        <Card>
          <CardHeader>
            <CardTitle>{t("skus.view.notFound.title")}</CardTitle>
            <CardDescription>
              {t("skus.view.notFound.description")}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </DashboardPage>
  );
};

export default ViewSkuPage;
