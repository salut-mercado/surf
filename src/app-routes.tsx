import { lazy } from "react";
import { Redirect, Route, Switch } from "wouter";
import { useAuth } from "~/hooks/use-auth";
import { DashboardPage } from "./components/dashboard-page";

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
const ViewSkuPage = lazy(
  () => import("./pages/skus/pages/view/view-sku.page")
);
const EditSkuPage = lazy(
  () => import("./pages/skus/pages/edit/edit-sku.page")
);
const SkusPage = lazy(() => import("./pages/skus/skus.page"));

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Switch>
      <Route path="/auth" nest>
        <Route path="/login">
          <AuthPage />
        </Route>
      </Route>
      {isAuthenticated && (
        <>
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
        </>
      )}
      <Route path="*">
        {isAuthenticated ? (
          <DashboardPage>404 Page</DashboardPage>
        ) : (
          <Redirect to="/auth/login" />
        )}
      </Route>
    </Switch>
  );
};
