import { Redirect, Route, Switch } from "wouter";
import { useAuth } from "~/hooks/use-auth";
import { TenantRequired } from "./components/app-no-tenant-selected";
import { DashboardPage } from "./components/dashboard-page";
import { Spinner } from "./components/ui/spinner";
import { api } from "./hooks/api";

import AuthPage from "./pages/auth/auth.page";
import CategoriesListPage from "./pages/categories/categories.page";
import CreateCategoryPage from "./pages/categories/pages/create/create-category.page";
import EditCategoryPage from "./pages/categories/pages/edit/edit-category.page";
import ViewCategoryPage from "./pages/categories/pages/view/view-category.page";
import CreateProducerPage from "./pages/producers/pages/create/create-producer.page";
import EditProducerPage from "./pages/producers/pages/edit/edit-producer.page";
import ViewProducerPage from "./pages/producers/pages/view/view-producer.page";
import ProducersListPage from "./pages/producers/producers.page";
import CreateSkuPage from "./pages/skus/pages/create/create-sku.page";
import EditSkuPage from "./pages/skus/pages/edit/edit-sku.page";
import ViewSkuPage from "./pages/skus/pages/view/view-sku.page";
import SkusPage from "./pages/skus/skus.page";
import CreateStorePage from "./pages/stores/pages/create/create-store.page";
import EditStorePage from "./pages/stores/pages/edit/edit-store.page";
import InventoryPage from "./pages/stores/pages/view/pages/inventory.page";
import InventoryCreateInflowPage from "./pages/stores/pages/view/pages/pages/create/inventory.create-inflow.page";
import InventoryViewPage from "./pages/stores/pages/view/pages/pages/view/inventory.view.page";
import PosPage from "./pages/stores/pages/view/pages/pos.page";
import ViewStorePage from "./pages/stores/pages/view/view-store.page";
import CreateSupplierPage from "./pages/suppliers/pages/create/create-supplier.page";
import EditSupplierPage from "./pages/suppliers/pages/edit/edit-supplier.page";
import ViewSupplierPage from "./pages/suppliers/pages/view/view-supplier.page";
import SuppliersPage from "./pages/suppliers/suppliers.page";
import UiKitPage from "./pages/ui-kit/ui-kit.page";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { isLoading } = api.auth.useMe();
  if (isLoading) {
    return (
      <div className="z-50 bg-background fixed top-0 left-0 flex justify-center items-center right-0 bottom-0">
        <Spinner className="size-10" />
      </div>
    );
  }
  return (
    <Switch>
      <Route path="/auth" nest>
        <Route path="/login">
          <AuthPage />
        </Route>
      </Route>
      {isAuthenticated && (
        <TenantRequired>
          <Route path="/suppliers" nest>
            <Switch>
              <Route path="/create">
                <CreateSupplierPage />
              </Route>
              <Route path="/:id/edit">
                <EditSupplierPage />
              </Route>
              <Route path="/:id">
                <ViewSupplierPage />
              </Route>
              <Route>
                <SuppliersPage />
              </Route>
            </Switch>
          </Route>
          <Route path="/producers" nest>
            <Switch>
              <Route path="/create">
                <CreateProducerPage />
              </Route>
              <Route path="/:id/edit">
                <EditProducerPage />
              </Route>
              <Route path="/:id">
                <ViewProducerPage />
              </Route>
              <Route>
                <ProducersListPage />
              </Route>
            </Switch>
          </Route>
          <Route path="/categories" nest>
            <Switch>
              <Route path="/create">
                <CreateCategoryPage />
              </Route>
              <Route path="/:id/edit">
                <EditCategoryPage />
              </Route>
              <Route path="/:id">
                <ViewCategoryPage />
              </Route>
              <Route>
                <CategoriesListPage />
              </Route>
            </Switch>
          </Route>
          <Route path="/skus" nest>
            <Switch>
              <Route path="/create">
                <CreateSkuPage />
              </Route>
              <Route path="/:id/edit">
                <EditSkuPage />
              </Route>
              <Route path="/:id">
                <ViewSkuPage />
              </Route>
              <Route>
                <SkusPage />
              </Route>
            </Switch>
          </Route>
          <Route path="/stores" nest>
            <Switch>
              <Route path="/create">
                <CreateStorePage />
              </Route>
              <Route path="/:id/edit">
                <EditStorePage />
              </Route>
              <Route path="/:id/pos">
                <PosPage />
              </Route>
              <Route path="/:id/inventory/create">
                <InventoryCreateInflowPage />
              </Route>
              <Route path="/:id/inventory/:skuId">
                <InventoryViewPage />
              </Route>
              <Route path="/:id/inventory">
                <InventoryPage />
              </Route>
              <Route path="/:id">
                <ViewStorePage />
              </Route>
            </Switch>
          </Route>
          <Route path="/ui-kit">
            <UiKitPage />
          </Route>
          <Route path="/">
            <DashboardPage>Overview page</DashboardPage>
          </Route>
        </TenantRequired>
      )}
      <Route path="*">
        <Redirect to="/auth/login" />
      </Route>
    </Switch>
  );
};
