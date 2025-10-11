import { skipToken } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/hooks/api";
import { ProducerForm } from "../../components/producer.form";

const EditProducerPage = () => {
  const { id } = useParams();
  const updateProducer = api.producers.useUpdate();
  const [, setLocation] = useLocation();
  const producer = api.producers.useGetById(id ? { id } : skipToken);
  if (producer.isLoading) return <Skeleton className="h-10 w-full" />;
  if (producer.isError || id === undefined) return <div>Error</div>;
  if (!producer.data) return <div>Producer not found</div>;
  return (
    <DashboardPage>
      <ProducerForm
        onSubmit={async (data) => {
          const updated = await updateProducer.mutateAsync({
            id,
            firmsProducerUpdateSchema: data,
          });
          if (updated) {
            setLocation(`~/producers/${id}`, { replace: true });
          }
        }}
        isSubmitting={updateProducer.isPending}
        initialValues={producer.data}
        submitLabel="Edit Producer"
      />
    </DashboardPage>
  );
};

export default EditProducerPage;
