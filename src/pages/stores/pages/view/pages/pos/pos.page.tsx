import { DashboardPage } from "~/components/dashboard-page";
import { Card } from "~/components/ui/card";
import { ItemByCategoryViewer } from "./components/Item-by-category-viewer";
import { PosContextProvider } from "./components/pos.context";
import { Cart } from "./components/cart";
import { api } from "~/hooks/api";
import { useParams } from "wouter";
import { skipToken } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";

const PosPage = () => {
  const { id: storeId = "" } = useParams<{ id?: string }>();
  const inventory = api.inventory.useGetInventory(
    storeId ? { storeId } : skipToken
  );
  const categories = api.categories.useGetAll({
    limit: 1000,
  });
  const inventoryItems = inventory.data?.items ?? [];
  return (
    <PosContextProvider>
      <DashboardPage className="grid h-[calc(100vh-var(--header-height))] min-h-0 overflow-hidden lg:grid-cols-3 gap-2">
        {inventory.isLoading || categories.isLoading ? (
          <Skeleton className="w-full h-full col-span-2" />
        ) : (
          <Card className="col-span-2 h-full overflow-hidden p-2">
            <ItemByCategoryViewer
              inventory={inventoryItems}
              categories={categories.data ?? []}
            />
          </Card>
        )}
        {inventory.isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Card className="p-2 h-full">
            <Cart inventory={inventoryItems} />
          </Card>
        )}
      </DashboardPage>
    </PosContextProvider>
  );
};

export default PosPage;
