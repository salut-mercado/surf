import { useState, useMemo } from "react";
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
import type { SKUSchema } from "@salut-mercado/octo-client";
import { Button } from "~/components/ui/button";

type SkuWithId = SKUSchema & { id: string };

interface SkusTableProps {
    skus: SkuWithId[];
}

export function SkusTable({ skus }: SkusTableProps) {
    const [search, setSearch] = useState("");

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
        autoResetPageIndex: false,
    });

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
                        {table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} className="hover:bg-muted/10">
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} className="pl-2">
                                        {cell.renderValue() as React.ReactNode}
                                    </TableCell>
                                ))}
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