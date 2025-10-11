import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, Eye } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { CategoryReturnSchema } from "@salut-mercado/octo-client";
import { Link } from "wouter";

interface CategoryNode extends CategoryReturnSchema {
  children: CategoryNode[];
}

function buildCategoryTree(categories: CategoryReturnSchema[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();
  const rootCategories: CategoryNode[] = [];

  // Create nodes for all categories
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
    });
  });

  // Build the tree structure
  categories.forEach((category) => {
    const node = categoryMap.get(category.id)!;
    if (category.parentCategoryId == null) {
      rootCategories.push(node);
    } else {
      const parent = categoryMap.get(category.parentCategoryId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return rootCategories;
}

function CategoryTreeItem({ category }: { category: CategoryNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children.length > 0;

  return (
    <div className="w-full">
      <div className="group flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent transition-colors">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={!hasChildren}
          className="h-6 w-6 p-0 hover:bg-accent-foreground/10"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>

        {/* Category Name */}
        <div className="flex-1 flex items-center gap-2">
          <span className="font-medium text-foreground">
            {category.categoryName}
          </span>
          {hasChildren && (
            <Badge variant="secondary" className="h-5 px-2 text-xs">
              {category.children.length}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            asChild
          >
            <Link href={`/${category.id}`}>
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            asChild
          >
            <Link href={`/create?parent=${category.id}`}>
              <Plus className="h-3.5 w-3.5" />
              Add Subcategory
            </Link>
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-6 border-l border-border pl-3 mt-1 space-y-1">
          {category.children.map((child) => (
            <CategoryTreeItem key={child.id} category={child} />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryTreeProps {
  categories: CategoryReturnSchema[];
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  const categoryTree = buildCategoryTree(categories);

  return (
    <div className="space-y-1">
      {categoryTree.map((category) => (
        <CategoryTreeItem key={category.id} category={category} />
      ))}
    </div>
  );
}
