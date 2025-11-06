import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export type CategoryFormValues = {
  categoryName: string;
  parentCategoryId: string | null;
};

// Internal form values (without parent selection)
type InternalFormValues = {
  categoryName: string;
};

export type CategoryOption = {
  id: string;
  category_name: string;
  level: number;
};

export function CategoryForm({
  categories,
  initial,
  onSubmit,
  submitting,
}: {
  categories: CategoryOption[];
  initial?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues & { level: number }) => void;
  submitting?: boolean;
}) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<InternalFormValues>({
    categoryName: initial?.categoryName ?? "",
  });

  const byId = useMemo(() => {
    const map = new Map<string, CategoryOption>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const handleSubmit = () => {
    const parent = initial?.parentCategoryId
      ? byId.get(initial.parentCategoryId)
      : undefined;
    const level = parent ? parent.level + 1 : 0;
    onSubmit({
      categoryName: values.categoryName,
      parentCategoryId: initial?.parentCategoryId ?? null,
      level
    });
  };

  return (
    <div className="space-y-4 py-2">
      {initial?.parentCategoryId && (
        <div className="space-y-2">
          <Label>{t("categories.form.parentCategory")}</Label>
          <div className="p-3 bg-muted rounded-md text-sm">
            {byId.get(initial.parentCategoryId)?.category_name || t("categories.form.unknownParent")}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label>{t("categories.form.categoryName")}</Label>
        <Input
          value={values.categoryName}
          onChange={(e) => {
            setValues((v) => ({ ...v, categoryName: e.target.value }));
            if (error) setError(null);
          }}
        />
      </div>
      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? t("categories.form.saving") : t("categories.form.save")}
      </Button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
