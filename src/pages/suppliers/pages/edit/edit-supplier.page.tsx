import { api } from "~/hooks/api";
import { SupplierForm } from "../../components/supplier.form";
import { DashboardPage } from "~/components/dashboard-page";
import { useLocation, useParams } from "wouter";
import { skipToken } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";

const EditSupplierPage = () => {
  const { id } = useParams();
  const createSupplier = api.suppliers.useUpdate();
  const [, setLocation] = useLocation();
  const supplier = api.suppliers.useGetById(id ? { id } : skipToken);
  if (supplier.isLoading) return <Skeleton className="h-10 w-full" />;
  if (supplier.isError) return <div>Error</div>;
  if (!supplier.data) return <div>Supplier not found</div>;
  return (
    <DashboardPage>
      <SupplierForm
        onSubmit={async (data) => {
          const updated = await createSupplier.mutateAsync({
            id: data.id,
            supplierUpdateSchema: data,
          });
          if (updated) {
            setLocation(`~/suppliers/${updated.id}`, { replace: true });
          }
        }}
        isSubmitting={createSupplier.isPending}
        initialValues={supplier.data}
        submitLabel="Edit Supplier"
      />
    </DashboardPage>
  );
};

export default EditSupplierPage;
