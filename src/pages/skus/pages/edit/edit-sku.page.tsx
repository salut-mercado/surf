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
              supplierId: data.supplierId,
              producerId: data.producerId,
              categoryId: data.categoryId,
              unitMeasurement: data.unitMeasurement,
              shelfLifetime: data.shelfLifetime,
              netWeight: data.netWeight,
              vatPercent: data.vatPercent,
              alcoholPercent: data.alcoholPercent,
              naturalLossPercent: data.naturalLossPercent,
              maxOnCheckout: data.maxOnCheckout,
              specifications: data.specifications ?? "",
              wholesalePrice: data.wholesalePrice,
              barcode: data.barcode,
            },
          });
          if (updated) setLocation(`/${updated.id}`, { replace: true });
        }}
      />
    </DashboardPage>
  );
};

export default EditSkuPage;


