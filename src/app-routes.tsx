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
            <Route path="/suppliers/:search?">
                <SuppliersPage/>
            </Route>
            <Route path="/producers/:search?">
                <ProducersPage/>
            </Route>
            <Route path="/categories/:search?">
                <CategoriesPage/>
            </Route>
            <Route path="/sku/:search?">
                <SkuPage/>
            </Route>
            <Route path="*">404 Page</Route>
        </Switch>
    );
};
