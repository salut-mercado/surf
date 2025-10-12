import { DashboardPage } from "~/components/dashboard-page";
import { SkuForm } from "../../components/sku.form";
import { api } from "~/hooks/api";
import { useLocation } from "wouter";

const CreateSkuPage = () => {
  const createSku = api.skus.useCreate();
  const [, setLocation] = useLocation();

  return (
    <DashboardPage>
      <SkuForm
        submitLabel="Create SKU"
        isSubmitting={createSku.isPending}
        onSubmit={async (data) => {
          const created = await createSku.mutateAsync({ sKUSchema: data });
          if (created?.id) setLocation(`/${created.id}`, { replace: true });
        }}
      />
    </DashboardPage>
  );
};

export default CreateSkuPage;


