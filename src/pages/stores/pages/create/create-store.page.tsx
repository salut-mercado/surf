import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { api } from "~/hooks/api";
import { StoreForm } from "../../components/store.form";

const CreateStorePage = () => {
  const { t } = useTranslation();
  const createStore = api.stores.useCreate();
  const [, setLocation] = useLocation();
  return (
    <DashboardPage>
      <StoreForm
        submitLabel={t("stores.createStore")}
        onSubmit={async (data) => {
          const created = await createStore.mutateAsync({
            storeSchema: {
              address: data.address,
              legal_entity: data.legal_entity,
              price: data.price,
              ip: data.ip,
              sales_area: data.sales_area,
              total_area: data.total_area,
              date_of_first_sale: data.date_of_first_sale,
              working_hours: data.working_hours,
              claster: data.claster,
              contacts: data.contacts,
              assortment_matrix: data.assortment_matrix,
              service_provider: data.service_provider,
            },
          });
          if (created) {
            setLocation(`~/stores/${created.data.id}`, { replace: true });
          }
        }}
        isSubmitting={createStore.isPending}
      />
    </DashboardPage>
  );
};

export default CreateStorePage;
