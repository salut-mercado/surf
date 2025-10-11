import { useLocation } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { api } from "~/hooks/api";
import { ProducerForm } from "../../components/producer.form";

const CreateProducerPage = () => {
  const createProducer = api.producers.useCreate();
  const [, setLocation] = useLocation();
  return (
    <DashboardPage>
      <ProducerForm
        onSubmit={async (data) => {
          const created = await createProducer.mutateAsync({
            firmsProducerSchema: data,
          });
          if (created) {
            setLocation(`~/producers/${created.id}`, { replace: true });
          }
        }}
        isSubmitting={createProducer.isPending}
      />
    </DashboardPage>
  );
};

export default CreateProducerPage;
