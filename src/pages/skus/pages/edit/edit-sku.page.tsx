import { useTranslation } from "react-i18next";
import { DashboardPage } from "~/components/dashboard-page";
import { SkuForm } from "../../components/sku.form";
import { api } from "~/hooks/api";
import { skipToken } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { useLocation, useParams } from "wouter";

const EditSkuPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const sku = api.skus.useGetById(id ? { id } : skipToken);
  const updateSku = api.skus.useUpdate();

  if (sku.isLoading) return <Skeleton className="h-10 w-full" />;
  if (sku.isError) return <div>{t("skus.view.error")}</div>;
  if (!sku.data) return <div>{t("skus.view.notFound.title")}</div>;

  return (
    <DashboardPage>
      <SkuForm
        submitLabel={t("skus.editSku")}
        isSubmitting={updateSku.isPending}
        initialValues={sku.data}
        onSubmit={async (data) => {
          const updated = await updateSku.mutateAsync({
            id: sku.data.id,
            sKUUpdateSchema: {
              name: data.name,
              supplier_id: data.supplier_id,
              producer_id: data.producer_id,
              category_id: data.category_id,
              unit_measurement: data.unit_measurement,
              shelf_lifetime: data.shelf_lifetime,
              net_weight: data.net_weight,
              vat_percent: data.vat_percent,
              alcohol_percent: data.alcohol_percent,
              natural_loss_percent: data.natural_loss_percent,
              max_on_checkout: data.max_on_checkout,
              specifications: data.specifications ?? "",
              wholesale_price: data.wholesale_price,
              retail_price_1: data.retail_price_1,
              retail_price_2: data.retail_price_2,
              barcode: data.barcode,
            },
          });
          if (updated) setLocation(`/${updated.data.id}`, { replace: true });
        }}
      />
    </DashboardPage>
  );
};

export default EditSkuPage;
