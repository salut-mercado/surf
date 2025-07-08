import {Route, Switch} from "wouter"
import {lazy} from "react"

const AuthPage = lazy(() => import("./pages/auth/auth.page"))
const ExamplePage = lazy(() => import("./pages/example/example.page"))
const SuppliersPage = lazy(() => import("./pages/suppliers/suppliers.page"))
const ProducersPage = lazy(() => import("./pages/producers/producers-page"));
const CategoriesPage = lazy(() => import('./pages/category/category-page'));
const SkuPage = lazy(() => import('./pages/sku/sku-page'));


export const AppRoutes = () => {
    return (
        <Switch>
            <Route path="/auth" nest>
                <Route path="/login">
                    <AuthPage/>
                </Route>
            </Route>
            <Route path="/example">
                <ExamplePage/>
            </Route>
            <Route path="/suppliers">
                <SuppliersPage/>
            </Route>
            <Route path="/producers">
                <ProducersPage/>
            </Route>
            <Route path="/categories">
                <CategoriesPage/>
            </Route>
            <Route path="/sku">
                <SkuPage/>
            </Route>
            <Route path="*">404 Page</Route>
        </Switch>
    );
};
