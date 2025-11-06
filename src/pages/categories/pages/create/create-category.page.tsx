import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useSearch } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/hooks/api";
import { CategoryForm } from "../../components/category.form";

export default function CreateCategoryPage() {
  const { t } = useTranslation();
  const categories = api.categories.useGetAll({ limit: 1000 });
  const create = api.categories.useCreate();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const urlParams = new URLSearchParams(search);
  const parentId = urlParams.get("parent");

  const options = useMemo(() => {
    const list = (categories.data ?? []) as {
      id: string;
      category_name: string;
      level: number;
    }[];
    return list.map((c) => ({
      id: c.id,
      category_name: c.category_name,
      level: c.level,
    }));
  }, [categories.data]);

  return (
    <DashboardPage>
      <Card>
        <CardHeader>
          <CardTitle>{t("categories.createCategory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm
            categories={options}
            initial={{ parentCategoryId: parentId }}
            onSubmit={async (vals) => {
              const res = await create.mutateAsync({
                categorySchema: {
                  category_name: vals.categoryName,
                  parent_category_id: parentId ?? undefined,
                  level: vals.level,
                },
              });
              if (res) {
                setLocation(`/${res.data.id}`, {
                  replace: true,
                });
              } else {
                setLocation("/", { replace: true });
              }
            }}
            submitting={create.isPending}
          />
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
