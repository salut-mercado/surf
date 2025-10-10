import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { useCategories } from "~/pages/category/use-category.ts";
import { CategoriesTable } from "~/pages/category/category-table";
import { useCreateCategories } from "~/pages/category/use-create-category";
import { useUpdateCategories } from "~/pages/category/use-update-category";
import type {
  CategorySchema,
  UpdateCategoryHandlerApiCategoriesCategoriesIdPutRequest,
} from "@salut-mercado/octo-client";

export type CategoryWithId = CategorySchema & { id: string };

export default function CategoriesPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: categories = [], refetch } = useCategories({});
  const createMutation = useCreateCategories();
  const updateMutation = useUpdateCategories();

  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    parentCategoryId: null as string | null,
  });

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithId | null>(null);

  const handleCreateCategory = async () => {
    try {
      let level = 0;
      if (newCategory.parentCategoryId) {
        const parent = categories.find(
          (c: { id: string | null }) => c.id === newCategory.parentCategoryId
        );
        if (!parent) {
          console.error("Parent category not found");
          return;
        }
        level = parent.level + 1;
      }

      const requestData = {
        categorySchema: {
          categoryName: newCategory.categoryName,
          parentCategoryId: newCategory.parentCategoryId || undefined,
          level: level,
        },
      };

      const nameExists = categories.some(
        (cat: CategoryWithId) =>
          cat.categoryName.toLowerCase() ===
          newCategory.categoryName.trim().toLowerCase()
      );

      if (nameExists) {
        setError("Category name already exists");
        return;
      }

      await createMutation.mutateAsync(requestData);
      refetch();
      setOpenCreate(false);
      setNewCategory({ categoryName: "", parentCategoryId: null });
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    try {
      const requestData: UpdateCategoryHandlerApiCategoriesCategoriesIdPutRequest =
        {
          categoriesId: selectedCategory.id,
          categoryUpdateSchema: {
            categoryName: selectedCategory.categoryName,
          },
        };

      const nameExists = categories.some(
        (cat: CategoryWithId) =>
          cat.categoryName.toLowerCase() ===
          selectedCategory.categoryName.trim().toLowerCase()
      );

      if (nameExists) {
        setError("Category name already exists");
        return;
      }

      await updateMutation.mutateAsync(requestData);
      refetch();
      setOpenEdit(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage category hierarchy</CardDescription>
            </div>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input
                      value={newCategory.categoryName}
                      onChange={(e) => {
                        setNewCategory({
                          ...newCategory,
                          categoryName: e.target.value,
                        });
                        if (error) setError(null);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Parent Category</Label>
                    <Select
                      value={newCategory.parentCategoryId ?? "root"}
                      onValueChange={(value) =>
                        setNewCategory({
                          ...newCategory,
                          parentCategoryId: value === "root" ? null : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="root">
                          Root Category (Level 0)
                        </SelectItem>
                        {[...categories]
                          .sort((a, b) => a.level - b.level)
                          .map((category: CategoryWithId) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.categoryName} (Level {category.level})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleCreateCategory}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}
                  {createMutation.isError && (
                    <div className="text-red-500 text-sm">
                      Error: {createMutation.error.message}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <CategoriesTable
            categories={categories}
            onRowClick={(category) => {
              setSelectedCategory(category as CategoryWithId);
              setOpenEdit(true);
            }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={openEdit}
        onOpenChange={(open) => {
          if (!open) setSelectedCategory(null);
          setOpenEdit(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={selectedCategory.categoryName}
                  onChange={(e) => {
                    setSelectedCategory({
                      ...selectedCategory,
                      categoryName: e.target.value,
                    });
                    if (error) setError(null);
                  }}
                />
              </div>
              <Button
                onClick={handleEditCategory}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              {updateMutation.isError && (
                <div className="text-red-500 text-sm">
                  Error: {updateMutation.error.message}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
