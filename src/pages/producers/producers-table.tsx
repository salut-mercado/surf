import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import {Button} from "~/components/ui/button";
import type {FirmsProducerSchema} from "~/lib/.generated/client";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

interface ProducersTableProps {
    producers: FirmsProducerSchema[];
}


export function ProducersTable({producers}: ProducersTableProps) {
    const table = useReactTable({
        data: producers,
        columns: [
            {accessorKey: "name", header: "Name"},
            {accessorKey: "taxID", header: "Tax ID"},
            {accessorKey: "minimumStock", header: "Minimum Stock"},
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
                            <TableHead>Tax ID</TableHead>
                            <TableHead>Minimum Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.original.name}>
                                <TableCell>{row.original.name}</TableCell>
                                <TableCell>{row.original.taxID}</TableCell>
                                <TableCell>{row.original.minimumStock}</TableCell>
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