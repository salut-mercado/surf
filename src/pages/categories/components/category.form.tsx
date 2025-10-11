import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type CategoryFormValues = {
  categoryName: string;
  parentCategoryId: string | null;
};

export type CategoryOption = {
  id: string;
  categoryName: string;
  level: number;
};

export function CategoryForm({
  categories,
  initial,
  onSubmit,
  submitting,
  disabledOptionIds,
}: {
  categories: CategoryOption[];
  initial?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues & { level: number }) => void;
  submitting?: boolean;
  disabledOptionIds?: string[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<CategoryFormValues>({
    categoryName: initial?.categoryName ?? "",
    parentCategoryId:
      initial?.parentCategoryId === undefined ? null : initial.parentCategoryId,
  });

  const byId = useMemo(() => {
    const map = new Map<string, CategoryOption>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const handleSubmit = () => {
    const parent = values.parentCategoryId
      ? byId.get(values.parentCategoryId)
      : undefined;
    const level = parent ? parent.level + 1 : 0;
    onSubmit({ ...values, level });
  };

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>Category Name</Label>
        <Input
          value={values.categoryName}
          onChange={(e) => {
            setValues((v) => ({ ...v, categoryName: e.target.value }));
            if (error) setError(null);
          }}
        />
      </div>
      <div className="space-y-2">
        <Label>Parent Category</Label>
        <Select
          value={values.parentCategoryId ?? "root"}
          onValueChange={(val) =>
            setValues((v) => ({
              ...v,
              parentCategoryId: val === "root" ? null : val,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="root">Root Category (Level 0)</SelectItem>
            {[...categories]
              .sort((a, b) => a.level - b.level)
              .map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                  disabled={disabledOptionIds?.includes(c.id)}
                >
                  {c.categoryName} (Level {c.level})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Saving..." : "Save"}
      </Button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
