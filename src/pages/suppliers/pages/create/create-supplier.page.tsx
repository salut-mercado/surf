import { api } from "~/hooks/api";
import { SupplierForm } from "../../components/supplier.form";
import { DashboardPage } from "~/components/dashboard-page";
import { useLocation } from "wouter";

const CreateSupplierPage = () => {
  const createSupplier = api.suppliers.useCreate();
  const [, setLocation] = useLocation();
  return (
    <DashboardPage>
      <SupplierForm
        onSubmit={async (data) => {
          const created = await createSupplier.mutateAsync({
            supplierSchema: data,
          });
          if (created) {
            setLocation(`~/suppliers/${created.data.id}`, { replace: true });
          }
        }}
        isSubmitting={createSupplier.isPending}
      />
    </DashboardPage>
  );
};

export default CreateSupplierPage;
