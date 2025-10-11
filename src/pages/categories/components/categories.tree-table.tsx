import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export type CategoryNode = {
  id: string;
  categoryName: string;
  parentCategoryId?: string | null;
  level: number;
};

interface CategoriesTreeTableProps {
  categories: CategoryNode[];
}

export function CategoriesTreeTable({ categories }: CategoriesTreeTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedIds(next);
  };

  const filtered = categories;

  const buildTree = (
    parentId: string | null = null,
    level = 0
  ): (CategoryNode & { level: number })[] => {
    return filtered
      .filter((c) => (c.parentCategoryId || null) === parentId)
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
      .flatMap((n) => {
        const children = expandedIds.has(n.id)
          ? buildTree(n.id, level + 1)
          : [];
        return [{ ...n, level }, ...children];
      });
  };

  const rows = buildTree();

  const getParentName = (parentId?: string | null) => {
    if (!parentId) return "-";
    const parent = categories.find((c) => c.id === parentId);
    return parent?.categoryName ?? "-";
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="pl-30">Parent</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const hasChildren = categories.some(
                (c) => c.parentCategoryId === row.id
              );
              const isExpanded = expandedIds.has(row.id);

              return (
                <TableRow key={row.id}>
                  <TableCell className="pl-2">
                    <div
                      className="flex items-center space-x-2"
                      style={{ paddingLeft: `${row.level * 20}px` }}
                    >
                      {hasChildren ? (
                        <button onClick={() => toggleExpand(row.id)}>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        <span className="w-4 h-4 inline-block" />
                      )}
                      <span>{row.categoryName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{row.level}</TableCell>
                  <TableCell className="pl-30">
                    {getParentName(row.parentCategoryId)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-block">
                      <Button variant="ghost" asChild>
                        <Link href={`/${row.id}`}>
                          View <ChevronRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
