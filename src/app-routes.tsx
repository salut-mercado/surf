import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch } from "wouter";
import { useAuth } from "~/hooks/use-auth";
import { TenantRequired } from "./components/app-no-tenant-selected";
import { DashboardPage } from "./components/dashboard-page";

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
import InventoryPage from "./pages/stores/pages/view/pages/inventory/inventory.page";
import PosPage from "./pages/stores/pages/view/pages/pos/pos.page";
import ViewStorePage from "./pages/stores/pages/view/view-store.page";
import CreateSupplierPage from "./pages/suppliers/pages/create/create-supplier.page";
import EditSupplierPage from "./pages/suppliers/pages/edit/edit-supplier.page";
import ViewSupplierPage from "./pages/suppliers/pages/view/view-supplier.page";
import SuppliersPage from "./pages/suppliers/suppliers.page";
import { InflowsPage } from "./pages/stores/pages/view/pages/inflows/inflows.page";
import { CreateInflowPage } from "./pages/stores/pages/view/pages/inflows/pages/create/create-inflow.page";
import { ViewInflowPage } from "./pages/stores/pages/view/pages/inflows/pages/view/view-inflow.page";
const UiKitPage = lazy(() => import("./pages/ui-kit/ui-kit.page"));

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
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
              <Route path="/:id/inventory">
                <InventoryPage />
              </Route>
              <Route path="/:id/inflows/create">
                <CreateInflowPage />
              </Route>
              <Route path="/:id/inflows/:inflowId/edit">
                <ViewInflowPage /> // TODO: Create edit inflow page
              </Route>
              <Route path="/:id/inflows/:inflowId">
                <ViewInflowPage />
              </Route>
              <Route path="/:id/inflows">
                <InflowsPage />
              </Route>
              <Route path="/:id">
                <ViewStorePage />
              </Route>
              <Route path="/">
                <Redirect to="~/" />
              </Route>
            </Switch>
          </Route>
          {import.meta.env.DEV && (
            <Route path="/ui-kit">
              <UiKitPage />
            </Route>
          )}
          <Route path="/">
            <DashboardPage>{t("overviewPage")}</DashboardPage>
          </Route>
        </TenantRequired>
      )}
      <Route path="*">
        <Redirect to="/auth/login" />
      </Route>
    </Switch>
  );
};
