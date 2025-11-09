import type { CategoryReturnSchema } from "@salut-mercado/octo-client";

export function getDescendantCategoryIds(
  categories: CategoryReturnSchema[],
  parentCategoryId: string
): string[] {
  const valid = categories.filter(
    (c) => c.parent_category_id === parentCategoryId
  );
  if (valid.length === 0) return [parentCategoryId];

  const result = [
    parentCategoryId,
    ...valid.map((c) => getDescendantCategoryIds(categories, c.id)),
  ].flat();

  return result;
}
