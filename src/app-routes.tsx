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
const ProducersPage = lazy(() => import("./pages/producers/producers-page"));
const CategoriesPage = lazy(() => import("./pages/category/category-page"));
const SkuPage = lazy(() => import("./pages/sku/sku-page"));

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
          <Route path="/producers/:search?">
            <ProducersPage />
          </Route>
          <Route path="/categories/:search?">
            <CategoriesPage />
          </Route>
          <Route path="/sku/:search?">
            <SkuPage />
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
