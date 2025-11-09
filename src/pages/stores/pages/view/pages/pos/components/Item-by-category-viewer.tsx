import type {
  CategoryReturnSchema,
  StoreInventoryItemSchema,
} from "@salut-mercado/octo-client";
import { IconX } from "@tabler/icons-react";
import { skipToken } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "~/components/ui/input-group";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { api } from "~/hooks/api";
import { useDebounce } from "~/hooks/use-debounce";
import { getDescendantCategoryIds } from "~/lib/utils/get-descendant-category-ids";

export const ItemByCategoryViewer = () => {
  const { id: storeId } = useParams<{ id: string }>();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const categories = api.categories.useGetAll({
    limit: 1000,
  });
  const inventory = api.inventory.useGetInventory(
    storeId ? { storeId } : skipToken
  );
  const filteredCategories = useMemo(() => {
    return (
      categories.data?.filter(
        (category) => category.parent_category_id === null
      ) ?? []
    );
  }, [categories.data]);

  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return (
      categories.data?.filter(
        (category) => category.parent_category_id === selectedCategory
      ) ?? []
    );
  }, [categories.data, selectedCategory]);

  const validItemCategoryIds = useMemo(() => {
    if (!selectedSubcategory && !selectedCategory) {
      return categories.data?.map((c) => c.id) ?? [];
    }
    return getDescendantCategoryIds(
      categories.data ?? [],
      (selectedSubcategory || selectedCategory)!
    );
  }, [categories.data, selectedCategory, selectedSubcategory]);

  const items = useMemo(() => {
    if (!inventory.data) return [];
    const categoryPass = inventory.data.items.filter((item) =>
      validItemCategoryIds.includes(item.category_id)
    );
    const transformedSearch = debouncedSearch.trim().toLocaleLowerCase();
    const searchPass =
      transformedSearch === ""
        ? categoryPass
        : categoryPass.filter(
            (x) =>
              x.barcode.includes(transformedSearch) ||
              x.sku_name.toLocaleLowerCase().trim().includes(transformedSearch)
          );
    return searchPass;
  }, [inventory.data, validItemCategoryIds, debouncedSearch]);

  return (
    <div className="flex h-full min-h-0 flex-1">
      <div className="grid h-full min-h-0 w-full gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
        <ScrollArea className="h-full min-h-0 min-w-0">
          <MainCategoryView
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedSubcategory={setSelectedSubcategory}
            categories={filteredCategories}
          />
        </ScrollArea>
        <div className="flex min-h-0 min-w-0 flex-col h-full">
          <SearchInput search={search} setSearch={setSearch} />
          <div className="flex flex-col gap-2 py-2">
            <ScrollArea>
              <SubcategoryView
                subcategories={subcategories}
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
              />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <ItemView items={items} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

const SearchInput = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) => {
  return (
    <InputGroup>
      <InputGroupInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search items"
      />
      {search.trim() !== "" && (
        <InputGroupAddon align="inline-end">
          <Button
            variant="ghost"
            className="size-6"
            onClick={() => setSearch("")}
          >
            <IconX className="size-4" />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

const MainCategoryView = ({
  selectedCategory,
  setSelectedCategory,
  setSelectedSubcategory,
  categories,
}: {
  categories: CategoryReturnSchema[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubcategory: (subcategory: string | null) => void;
}) => {
  return (
    <div className="flex flex-col gap-2 p-2 pr-3">
      {categories.map((category) => (
        <Button
          key={category.id}
          className="w-full justify-start whitespace-break-spaces text-left h-[unset]"
          variant={selectedCategory === category.id ? "secondary" : "ghost"}
          onClick={() => {
            if (selectedCategory === category.id) {
              setSelectedCategory(null);
            } else {
              setSelectedCategory(category.id);
            }
            setSelectedSubcategory(null);
          }}
        >
          {category.category_name}
          {selectedCategory === category.id && <Check className="size-4" />}
        </Button>
      ))}
    </div>
  );
};

const SubcategoryView = ({
  selectedSubcategory,
  setSelectedSubcategory,
  subcategories,
}: {
  subcategories: CategoryReturnSchema[];
  selectedSubcategory: string | null;
  setSelectedSubcategory: (subcategory: string | null) => void;
}) => {
  return (
    <div className="min-h-0 min-w-0 flex flex-row flex-nowrap gap-2">
      {subcategories.map((subcategory) => (
        <Button
          key={subcategory.id}
          variant={
            selectedSubcategory === subcategory.id ? "secondary" : "ghost"
          }
          onClick={() => {
            if (selectedSubcategory === subcategory.id) {
              setSelectedSubcategory(null);
            } else {
              setSelectedSubcategory(subcategory.id);
            }
          }}
        >
          {subcategory.category_name}
          {selectedSubcategory === subcategory.id && (
            <Check className="size-4" />
          )}
        </Button>
      ))}
    </div>
  );
};

const ItemView = ({ items }: { items: StoreInventoryItemSchema[] }) => {
  return (
    <div className="grid grid-cols-3 gap-1 pb-2">
      {items.map((item) => (
        <Button
          className="p-1 whitespace-normal flex-wrap h-auto"
          variant="outline"
          key={item.sku_id}
        >
          <div className="text-sm font-medium">{item.sku_name}</div>
          <div className="text-xs text-muted-foreground font-mono">
            {item.barcode}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {item.quantity}
          </div>
        </Button>
      ))}
    </div>
  );
};
