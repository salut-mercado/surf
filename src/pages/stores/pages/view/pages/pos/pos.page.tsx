import { DashboardPage } from "~/components/dashboard-page";
import { Card } from "~/components/ui/card";
import { ItemByCategoryViewer } from "./components/Item-by-category-viewer";
import { PosContextProvider } from "./components/pos.context";
import { Cart } from "./components/cart";
import { api } from "~/hooks/api";
import { useParams } from "wouter";
import { skipToken } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { PosShortcuts } from "./components/pos-shortcuts";

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
        <div className="h-full min-h-0 col-span-2 grid grid-rows-3 gap-2">
          <div className="row-span-2 h-full min-h-0">
            {inventory.isLoading || categories.isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <Card className="flex h-full min-h-0 flex-col overflow-hidden pl-2 py-4 pr-4">
                <div className="flex-1 overflow-auto">
                  <ItemByCategoryViewer
                    inventory={inventoryItems}
                    categories={categories.data ?? []}
                  />
                </div>
              </Card>
            )}
          </div>
          <PosShortcuts className="w-full h-full min-h-0 row-span-1">
            Shortcuts
          </PosShortcuts>
        </div>
        {inventory.isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Card className="h-full min-h-0 p-4">
            <Cart inventory={inventoryItems} />
          </Card>
        )}
      </DashboardPage>
    </PosContextProvider>
  );
};

export default PosPage;
