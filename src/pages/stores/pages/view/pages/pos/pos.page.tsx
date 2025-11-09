import { DashboardPage } from "~/components/dashboard-page";
import { Skeleton } from "~/components/ui/skeleton";
import { PosContextProvider } from "./components/pos.context";
import { ItemByCategoryViewer } from "./components/Item-by-category-viewer";
import { Card } from "~/components/ui/card";

const PosPage = () => {
  return (
    <PosContextProvider>
      <DashboardPage className="grid h-[calc(100vh-var(--header-height))] min-h-0 overflow-hidden lg:grid-cols-3 gap-2">
        <Card className="col-span-2 h-full overflow-hidden p-2">
          <ItemByCategoryViewer />
        </Card>
        <Skeleton className="h-full min-h-0" />
      </DashboardPage>
    </PosContextProvider>
  );
};

export default PosPage;
