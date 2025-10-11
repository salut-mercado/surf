import { CreateSupplierForm } from "./components/create-supplier.form";
import { DashboardPage } from "~/components/dashboard-page";

const CreateSupplierPage = () => {
  return (
    <DashboardPage>
      <CreateSupplierForm onSubmit={() => {}} />
    </DashboardPage>
  );
};

export default CreateSupplierPage;