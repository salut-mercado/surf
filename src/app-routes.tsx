import { Redirect, Route, Switch } from "wouter";
import { lazy } from "react";
import { useAuth } from "~/hooks/use-auth";

const AuthPage = lazy(() => import("./pages/auth/auth.page"));
const ExamplePage = lazy(() => import("./pages/example/example.page"));
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
      <Route path="/example">
        <ExamplePage />
      </Route>
      <Route path="/suppliers/:search?">
        {isAuthenticated ? <SuppliersPage /> : <Redirect to="/auth/login" />}
      </Route>
      <Route path="/producers/:search?">
        {isAuthenticated ? <ProducersPage /> : <Redirect to="/auth/login" />}
      </Route>
      <Route path="/categories/:search?">
        {isAuthenticated ? <CategoriesPage /> : <Redirect to="/auth/login" />}
      </Route>
      <Route path="/sku/:search?">
        {isAuthenticated ? <SkuPage /> : <Redirect to="/auth/login" />}
      </Route>
      <Route path="*">404 Page</Route>
    </Switch>
  );
};
