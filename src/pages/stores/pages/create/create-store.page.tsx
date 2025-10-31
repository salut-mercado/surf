import { useLocation } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { api } from "~/hooks/api";
import { StoreForm } from "../../components/store.form";

const CreateStorePage = () => {
  const createStore = api.stores.useCreate();
  const [, setLocation] = useLocation();
  return (
    <DashboardPage>
      <StoreForm
        onSubmit={async (data) => {
          const created = await createStore.mutateAsync({
            storeSchema: {
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
          if (created) {
            setLocation(`~/stores/${created.id}`, { replace: true });
          }
        }}
        isSubmitting={createStore.isPending}
      />
    </DashboardPage>
  );
};

export default CreateStorePage;
