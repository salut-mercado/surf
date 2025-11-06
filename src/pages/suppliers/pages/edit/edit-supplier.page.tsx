import { skipToken } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "wouter";
import { api } from "~/hooks/api";
import { DashboardPage } from "~/components/dashboard-page";
import { Skeleton } from "~/components/ui/skeleton";
import { SupplierForm } from "../../components/supplier.form";

const EditSupplierPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const createSupplier = api.suppliers.useUpdate();
  const [, setLocation] = useLocation();
  const supplier = api.suppliers.useGetById(id ? { id } : skipToken);
  if (supplier.isLoading) return <Skeleton className="h-10 w-full" />;
  if (supplier.isError) return <div>{t("suppliers.view.error")}</div>;
  if (!supplier.data) return <div>{t("suppliers.view.notFound.title")}</div>;
  return (
    <DashboardPage>
      <SupplierForm
        onSubmit={async (data) => {
          const updated = await createSupplier.mutateAsync({
            id: data.id,
            supplierUpdateSchema: data,
          });
          if (updated) {
            setLocation(`~/suppliers/${updated.data.id}`, { replace: true });
          }
        }}
        isSubmitting={createSupplier.isPending}
        initialValues={supplier.data}
        submitLabel={t("suppliers.editSupplier")}
      />
    </DashboardPage>
  );
};

export default EditSupplierPage;
