
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { ChevronRight, ChevronDown, Edit, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import {useState} from "react";

export type CategoryWithId = {
    id: string;
    categoryName: string;
    level: number;
    parentCategoryId?: string | null;
};

interface CategoriesTableProps {
    categories: CategoryWithId[];
    onRowClick?: (category: CategoryWithId) => void;
}

export function CategoriesTable({ categories, onRowClick }: CategoriesTableProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedIds(newSet);
    };

    const getParentName = (parentId?: string | null) => {
        if (!parentId) return "-";
        const parent = categories.find((cat) => cat.id === parentId);
        return parent?.categoryName || "-";
    };

    const buildTree = (parentId: string | null = null, level = 0): CategoryWithId[] => {
        return categories
            .filter(cat => (cat.parentCategoryId || null) === parentId)
            .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
            .flatMap(cat => {
                const children = expandedIds.has(cat.id)
                    ? buildTree(cat.id, level + 1)
                    : [];
                return [{ ...cat, level }, ...children];
            });
    };

    const treeData = buildTree();

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
                        {treeData.map((row) => {
                            const hasChildren = categories.some(cat => cat.parentCategoryId === row.id);
                            const isExpanded = expandedIds.has(row.id);

                            return (
                                <TableRow key={row.id}>
                                    <TableCell className="pl-2">
                                        <div className="flex items-center space-x-2" style={{ paddingLeft: `${row.level * 20}px` }}>
                                            {hasChildren && (
                                                <button onClick={() => toggleExpand(row.id)}>
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                            {!hasChildren && <span className="w-4 h-4 inline-block" />}
                                            <span>{row.categoryName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{row.level}</TableCell>
                                    <TableCell className="pl-30">{getParentName(row.parentCategoryId)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-block mr-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted/20 transition-colors"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-32 rounded-md border border-border bg-popover text-popover-foreground shadow-lg"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() => onRowClick?.(row)}
                                                        className="cursor-pointer px-2 py-1 text-sm hover:bg-muted/20 hover:text-primary flex items-center gap-2"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
