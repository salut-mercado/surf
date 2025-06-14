import { Route, Switch } from "wouter"
import { lazy } from "react"

const AuthPage = lazy(() => import("./pages/auth/auth.page"))
const ExamplePage = lazy(() => import("./pages/example/example.page"))
const SuppliersPage = lazy(() => import("./pages/suppliers/suppliers.page"))

export const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/auth" nest>
        <Route path="/login">
          <AuthPage />
        </Route>
      </Route>
      <Route path="/addSuppliers">
        <ExamplePage />
      </Route>
      <Route path="/suppliers">
        <SuppliersPage />
      </Route>
      <Route path="*">404 Page</Route>
    </Switch>
  )
}
