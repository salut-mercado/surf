import { skipToken } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";
import { StoreForm } from "../../components/store.form";

const EditStorePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const updateStore = api.stores.useUpdate();
  const [, setLocation] = useLocation();
  const store = api.stores.useGetById(id ? { id } : skipToken);
  if (store.isLoading) return <Skeleton className="h-10 w-full" />;
  if (store.isError) return <div>{t("stores.view.error")}</div>;
  if (!store.data) return <div>{t("stores.view.notFound.title")}</div>;
  return (
    <DashboardPage>
      <StoreForm
        onSubmit={async (data) => {
          const updated = await updateStore.mutateAsync({
            id: data.id,
            storeUpdateSchema: {
              address: data.address,
              legalEntity: data.legalEntity,
              price: data.price,
              ip: data.ip,
              salesArea: data.salesArea,
              totalArea: data.totalArea,
              dateOfFirstSale: data.dateOfFirstSale,
              workingHours: data.workingHours,
              claster: data.claster,
              contacts: data.contacts,
              assortmentMatrix: data.assortmentMatrix,
              serviceProvider: data.serviceProvider,
            },
          });
          if (updated) {
            setLocation(`~/stores/${updated.id}`, { replace: true });
          }
        }}
        isSubmitting={updateStore.isPending}
        initialValues={store.data}
        submitLabel={t("stores.updateStore")}
      />
    </DashboardPage>
  );
};

export default EditStorePage;
