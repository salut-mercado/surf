
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";

import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type {CategorySchema} from "@salut-mercado/octo-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import {Edit, MoreHorizontal} from "lucide-react";

export type CategoryWithId = CategorySchema & { id: string };

interface CategoriesTableProps {
    categories: CategoryWithId[];
    onRowClick?: (category: CategoryWithId) => void;
}

export function CategoriesTable({ categories, onRowClick }: CategoriesTableProps) {
    const getParentName = (parentId?: string | null) => {
        if (!parentId) return "-";
        const parent = categories.find((cat) => cat.id === parentId);
        return parent?.categoryName || "-";
    };

    const table = useReactTable({
        data: categories,
        columns: [
            { accessorKey: "categoryName", header: "Name" },
            { accessorKey: "level", header: "Level" },
            {
                accessorKey: "parentCategoryId",
                header: "Parent",
                cell: ({ row }) => getParentName(row.original.parentCategoryId),
            },
        ],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead className= "pl-30" >Parent</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.original.id}>
                                <TableCell className="pl-2">{row.original.categoryName}</TableCell>
                                <TableCell>{row.original.level}</TableCell>
                                <TableCell className= "pl-30" >{getParentName(row.original.parentCategoryId)}</TableCell>
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
                                                    onClick={() => onRowClick?.(row.original)}
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
                        ))}
                    </TableBody>
                </Table>


            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}