import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Eye,
  Move,
  X,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { CategoryReturnSchema } from "@salut-mercado/octo-client";
import { Link } from "wouter";
import { api } from "~/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonGroup } from "~/components/ui/button-group";

interface CategoryNode extends CategoryReturnSchema {
  children: CategoryNode[];
}

export function buildCategoryTree(categories: CategoryReturnSchema[]): CategoryNode[] {
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

function CategoryTreeItem({
  category,
  isMoving = false,
  movingCategoryId,
  selectedParentId,
  illegalParentIds,
  onMoveStart,
  onParentSelect,
}: {
  category: CategoryNode;
  isMoving?: boolean;
  movingCategoryId?: string | null;
  selectedParentId?: string | null;
  illegalParentIds?: Set<string>;
  onMoveStart?: (categoryId: string) => void;
  onParentSelect?: (parentId: string | null) => void;
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children.length > 0;
  const isSelected = selectedParentId === category.id;
  const isBeingMoved = movingCategoryId === category.id;
  const isDisabledAsParent = !!illegalParentIds?.has(category.id);

  const handleItemClick = () => {
    if (isMoving && !isBeingMoved && !isDisabledAsParent && onParentSelect) {
      onParentSelect(category.id);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`group flex items-center gap-2 rounded-md px-3 py-2 transition-colors border ${
          isMoving
            ? isBeingMoved
              ? "bg-muted cursor-not-allowed opacity-70"
              : isSelected
                ? "bg-accent cursor-pointer"
                : isDisabledAsParent
                  ? "bg-muted/50 cursor-not-allowed opacity-60"
                  : "hover:bg-accent cursor-pointer"
            : "hover:bg-accent border-transparent"
        }`}
        onClick={handleItemClick}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
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

        {isMoving && (
          <div className="h-6 w-6 flex items-center justify-center">
            {isSelected && <Check className="h-4 w-4 text-foreground" />}
          </div>
        )}

        {/* Category Name */}
        <div className="flex-1 flex items-center gap-2">
          <span
            className={`font-medium ${isBeingMoved ? "text-muted-foreground" : "text-foreground"}`}
          >
            {category.categoryName}
          </span>
          {hasChildren && (
            <Badge variant="secondary" className="h-5 px-2 text-xs">
              {category.children.length}
            </Badge>
          )}
          {isBeingMoved && (
            <Badge variant="destructive" className="h-5 px-2 text-xs">
              {t("categories.tree.moving")}
            </Badge>
          )}
        </div>

        {!isMoving && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              asChild
            >
              <Link href={`/${category.id}`}>
                <Eye className="h-3.5 w-3.5" />
                {t("categories.tree.view")}
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
                {t("categories.tree.addSubcategory")}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onMoveStart?.(category.id);
              }}
            >
              <Move className="h-3.5 w-3.5" />
              {t("categories.tree.move")}
            </Button>
          </div>
        )}

        {isMoving && !isBeingMoved && (
          <div className="text-xs text-muted-foreground">
            {isDisabledAsParent
              ? t("categories.tree.cannotSelect")
              : t("categories.tree.clickToSelect")}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-6 border-l border-border pl-3 mt-1 space-y-1">
          {category.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              isMoving={isMoving}
              movingCategoryId={movingCategoryId}
              selectedParentId={selectedParentId}
              illegalParentIds={illegalParentIds}
              onMoveStart={onMoveStart}
              onParentSelect={onParentSelect}
            />
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
  const { t } = useTranslation();
  const [movingCategoryId, setMovingCategoryId] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const queryClient = useQueryClient();
  const updateCategory = api.categories.useUpdate();

  const categoryTree = buildCategoryTree(categories);
  const movingCategory = movingCategoryId
    ? categories.find((c) => c.id === movingCategoryId)
    : null;

  // Build parent->children adjacency for descendant checks
  const childrenByParent = new Map<string, string[]>();
  categories.forEach((c) => {
    const key = c.parentCategoryId ?? "__root__";
    const list = childrenByParent.get(key) ?? [];
    list.push(c.id);
    childrenByParent.set(key, list);
  });

  const collectDescendants = (id: string, acc: Set<string>) => {
    const children = childrenByParent.get(id) ?? [];
    for (const childId of children) {
      if (!acc.has(childId)) {
        acc.add(childId);
        collectDescendants(childId, acc);
      }
    }
  };

  const illegalParentIds: Set<string> | undefined = movingCategoryId
    ? (() => {
        const s = new Set<string>([movingCategoryId]);
        collectDescendants(movingCategoryId, s);
        return s;
      })()
    : undefined;

  const handleMoveStart = (categoryId: string) => {
    setMovingCategoryId(categoryId);
    setSelectedParentId(null);
  };

  const handleMoveCancel = () => {
    setMovingCategoryId(null);
    setSelectedParentId(null);
  };

  const handleMoveConfirm = async () => {
    if (
      movingCategoryId &&
      selectedParentId !== movingCategory?.parentCategoryId
    ) {
      setIsMoving(true);
      try {
        await updateCategory.mutateAsync({
          categoriesId: movingCategoryId,
          categoryUpdateSchema: {
            parentCategoryId: selectedParentId ?? null,
          },
        });

        await queryClient.invalidateQueries({ queryKey: ["categories"] });

        setMovingCategoryId(null);
        setSelectedParentId(null);
      } catch (error) {
        console.error("Failed to move category:", error);
      } finally {
        setIsMoving(false);
      }
    }
  };

  const handleParentSelect = (parentId: string | null) => {
    setSelectedParentId(parentId);
  };

  return (
    <div className="space-y-1">
      {movingCategoryId && (
        <div className="mb-4 p-3 bg-muted border rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {t("categories.tree.movingCategory", { categoryName: movingCategory?.categoryName })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMoveCancel}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                {t("categories.tree.cancel")}
              </Button>
              <ButtonGroup>
                {selectedParentId !== null && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleParentSelect(null)}
                    className="text-xs"
                  >
                    {t("categories.tree.makeRoot")}
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleMoveConfirm}
                  disabled={
                    selectedParentId === movingCategory?.parentCategoryId ||
                    isMoving
                  }
                  className="text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  {isMoving ? t("categories.tree.movingInProgress") : t("categories.tree.moveHere")}
                </Button>
              </ButtonGroup>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {selectedParentId === null
              ? t("categories.tree.makeRootHint")
              : t("categories.tree.moveUnderHint", { categoryName: categories.find((c) => c.id === selectedParentId)?.categoryName ?? "" })}
          </p>
        </div>
      )}

      {categoryTree.map((category) => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          isMoving={movingCategoryId !== null}
          movingCategoryId={movingCategoryId}
          selectedParentId={selectedParentId}
          illegalParentIds={illegalParentIds}
          onMoveStart={handleMoveStart}
          onParentSelect={handleParentSelect}
        />
      ))}
    </div>
  );
}
