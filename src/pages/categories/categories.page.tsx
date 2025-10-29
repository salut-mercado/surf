import { Plus } from "lucide-react";
import { Link } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Button } from "~/components/ui/button";
import { api } from "~/hooks/api";
import { CategoriesEmptyState } from "./categories.empty-state";
import { CategoriesErrorState } from "./categories.error-state";
import { CategoriesSkeleton } from "./categories.skeleton";
import { CategoryTree } from "./components/category-tree";
import { Card, CardContent } from "~/components/ui/card";

export default function CategoriesPage() {
  const categories = api.categories.useGetAll({ limit: 1000 });

  const list = categories.data ?? [];

  return (
    <DashboardPage>
      {categories.isLoading && <CategoriesSkeleton />}
      {categories.isError && (
        <CategoriesErrorState message={categories.error.message} />
      )}
      {categories.isSuccess && list.length === 0 && <CategoriesEmptyState />}
      {categories.isSuccess && list.length > 0 && (
        <>
          <div className="mb-2 justify-end flex w-full">
            <Button asChild>
              <Link href="/create">
                <Plus className="size-4" />
                Add Category
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent>
              <CategoryTree categories={list} />
            </CardContent>
          </Card>
        </>
      )}
    </DashboardPage>
  );
}
