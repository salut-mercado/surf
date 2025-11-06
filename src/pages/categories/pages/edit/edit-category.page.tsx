import { skipToken } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/hooks/api";
import { CategoryForm } from "../../components/category.form";

export default function EditCategoryPage() {
  const { t } = useTranslation();
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
        category_name: c.category_name,
        level: c.level,
      })),
    [list]
  );

  const current = category.data;

  return (
    <DashboardPage>
      <Card>
        <CardHeader>
          <CardTitle>{t("categories.editCategory")}</CardTitle>
        </CardHeader>
        <CardContent>
          {current && (
            <CategoryForm
              categories={options}
              initial={{
                categoryName: current.category_name,
                parentCategoryId: current.parent_category_id ?? null,
              }}
              onSubmit={async (vals) => {
                const updated = await update.mutateAsync({
                  categoriesId: id!,
                  categoryUpdateSchema: {
                    category_name: vals.categoryName,
                    parent_category_id: vals.parentCategoryId ?? undefined,
                  },
                });
                if (updated) {
                  setLocation(`/${updated.data.id}`, { replace: true });
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
