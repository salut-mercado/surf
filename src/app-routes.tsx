import { lazy } from "react";
import { Redirect, Route, Switch } from "wouter";
import { useAuth } from "~/hooks/use-auth";
import { TenantRequired } from "./components/app-no-tenant-selected";
import { DashboardPage } from "./components/dashboard-page";
import { Spinner } from "./components/ui/spinner";
import { api } from "./hooks/api";

const UiKitPage = lazy(() => import("./pages/ui-kit/ui-kit.page"));
const AuthPage = lazy(() => import("./pages/auth/auth.page"));
const CreateSupplierPage = lazy(
  () => import("./pages/suppliers/pages/create/create-supplier.page")
);
const ViewSupplierPage = lazy(
  () => import("./pages/suppliers/pages/view/view-supplier.page")
);
const EditSupplierPage = lazy(
  () => import("./pages/suppliers/pages/edit/edit-supplier.page")
);
const SuppliersPage = lazy(() => import("./pages/suppliers/suppliers.page"));
const ProducersListPage = lazy(
  () => import("./pages/producers/producers.page")
);
const CreateProducerPage = lazy(
  () => import("./pages/producers/pages/create/create-producer.page")
);
const EditProducerPage = lazy(
  () => import("./pages/producers/pages/edit/edit-producer.page")
);
const ViewProducerPage = lazy(
  () => import("./pages/producers/pages/view/view-producer.page")
);
const CategoriesListPage = lazy(
  () => import("./pages/categories/categories.page")
);
const CreateCategoryPage = lazy(
  () => import("./pages/categories/pages/create/create-category.page")
);
const EditCategoryPage = lazy(
  () => import("./pages/categories/pages/edit/edit-category.page")
);
const ViewCategoryPage = lazy(
  () => import("./pages/categories/pages/view/view-category.page")
);
const CreateSkuPage = lazy(
  () => import("./pages/skus/pages/create/create-sku.page")
);
const ViewSkuPage = lazy(() => import("./pages/skus/pages/view/view-sku.page"));
const EditSkuPage = lazy(() => import("./pages/skus/pages/edit/edit-sku.page"));
const SkusPage = lazy(() => import("./pages/skus/skus.page"));
const CreateStorePage = lazy(
  () => import("./pages/stores/pages/create/create-store.page")
);
const ViewStorePage = lazy(
  () => import("./pages/stores/pages/view/view-store.page")
);
const EditStorePage = lazy(
  () => import("./pages/stores/pages/edit/edit-store.page")
);
const PosPage = lazy(() => import("./pages/stores/pages/view/pages/pos.page"));
const InventoryPage = lazy(
  () => import("./pages/stores/pages/view/pages/inventory.page")
);
const InventoryViewPage = lazy(
  () => import("./pages/stores/pages/view/pages/pages/view/inventory.view.page")
);
const InventoryCreateInflowPage = lazy(
  () =>
    import(
      "./pages/stores/pages/view/pages/pages/create/inventory.create-inflow.page"
    )
);

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
