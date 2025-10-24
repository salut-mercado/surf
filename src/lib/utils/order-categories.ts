import type { CategoryReturnSchema } from "@salut-mercado/octo-client";
import { buildCategoryTree } from "~/pages/categories/components/category-tree";

interface CategoryNode extends CategoryReturnSchema {
  children: CategoryNode[];
}

export const flattenCategoryTree = (
  tree: CategoryNode[]
): CategoryReturnSchema[] => {
  const result: CategoryReturnSchema[] = [];

  const traverse = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(tree);
  return result;
};

export const orderCategories = (categories: CategoryReturnSchema[]) => {
  const tree = buildCategoryTree(categories);
  return flattenCategoryTree(tree);
};
