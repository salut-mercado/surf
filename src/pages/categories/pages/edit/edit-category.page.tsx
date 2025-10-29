import { skipToken } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/hooks/api";
import { CategoryForm } from "../../components/category.form";

export default function EditCategoryPage() {
  const params = useParams();
  const id = params?.id;
  const category = api.categories.useGetById(
    id ? { categoriesId: id } : skipToken
  );
  const categories = api.categories.useGetAll({ limit: 1000 });
  const update = api.categories.useUpdate();
  const [, setLocation] = useLocation();
  const list = useMemo(() => categories.data ?? [], [categories.data]);
  const options = useMemo(
    () =>
      list.map((c) => ({
        id: c.id,
        categoryName: c.categoryName,
        level: c.level,
      })),
    [list]
  );

  const current = category.data;

  return (
    <DashboardPage>
      <Card>
        <CardHeader>
          <CardTitle>Edit Category</CardTitle>
        </CardHeader>
        <CardContent>
          {current && (
            <CategoryForm
              categories={options}
              initial={{
                categoryName: current.categoryName,
                parentCategoryId: current.parentCategoryId ?? null,
              }}
              onSubmit={async (vals) => {
                const updated = await update.mutateAsync({
                  categoriesId: id!,
                  categoryUpdateSchema: {
                    categoryName: vals.categoryName,
                    parentCategoryId: vals.parentCategoryId ?? undefined,
                  },
                });
                if (updated) {
                  setLocation(`/${updated.id}`, { replace: true });
                }
              }}
              submitting={update.isPending}
            />
          )}
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
