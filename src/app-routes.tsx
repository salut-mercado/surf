import { Route, Switch } from "wouter";
import { lazy } from "react";
const AuthPage = lazy(() => import("./pages/auth/auth.page"));

export const AppRoutes = () => {
    return (
        <Switch>
            <Route path="/auth" nest>
                <Route path="/login">
                    <AuthPage />
                </Route>
            </Route>
            <Route path="*">404 Page</Route>
        </Switch>
    );
};
