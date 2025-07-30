import {useState, useMemo, useEffect} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import {Edit, MoreHorizontal} from "lucide-react";
import type {SkuWithId} from "~/pages/sku/sku-page.tsx";
import {useLocation} from "wouter";

interface SkusTableProps {
    skus: SkuWithId[];
    onRowClick?: (sku: SkuWithId) => void;
    initialSearch?: string;
    onMoreClick?: (sku: SkuWithId) => void;

}

export function SkusTable({ skus, onMoreClick, onRowClick, initialSearch = "" }: SkusTableProps) {
    const [search, setSearch] = useState(initialSearch);
    const [, setLocation] = useLocation();

    const filteredSkus = useMemo(() => {
        return skus.filter(sku =>
            sku.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [skus, search]);

    const columns: ColumnDef<SkuWithId>[] = useMemo(() => [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "unitMeasurement", header: "Unit" },
        { accessorKey: "netWeight", header: "Net Weight" },
    ], []);

    const table = useReactTable({
        data: filteredSkus,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
        autoResetPageIndex: true,
    });

    useEffect(() => {
        setLocation(`/sku/${encodeURIComponent(search)}`);
    }, [search]);



    return (
        <div>
            <div className="mb-4">
                <Input
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 h-8 text-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.column.columnDef.header as string}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/10">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="pl-2">
                                        {cell.renderValue() as React.ReactNode}
                                    </TableCell>
                                ))}

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
                                                <DropdownMenuItem
                                                    onClick={() => onMoreClick?.(row.original)}
                                                    className="cursor-pointer px-2 py-1 text-sm hover:bg-muted/20 hover:text-primary flex items-center gap-2"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    More
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
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
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