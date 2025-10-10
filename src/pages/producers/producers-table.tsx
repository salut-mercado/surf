import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit, MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { ProducerWithId } from "~/pages/producers/producers-page.tsx";

interface ProducersTableProps {
  producers: ProducerWithId[];
  initialSearch?: string;
  onRowClick?: (producer: ProducerWithId) => void;
}

export function ProducersTable({
  producers,
  onRowClick,
  initialSearch = "",
}: ProducersTableProps) {
  const [search, setSearch] = useState(initialSearch);
  const [, setLocation] = useLocation();

  const filteredProducers = useMemo(() => {
    return producers.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [producers, search]);

  const columns: ColumnDef<ProducerWithId>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "nif", header: "Tax ID" },
      { accessorKey: "minimumStock", header: "Minimum Stock" },
    ],
    []
  );

  const table = useReactTable({
    data: filteredProducers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  useEffect(() => {
    setLocation(`/producers/${encodeURIComponent(search)}`);
  }, [search, setLocation]);

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
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tax ID</TableHead>
              <TableHead>Minimum Stock</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.original.nif}
                className="cursor-pointer hover:bg-muted/10"
              >
                <TableCell className="pl-2 ">
                  <div className="flex items-center">
                    <span className=" h-4 inline-block" />
                    <span>{row.original.name}</span>
                  </div>
                </TableCell>
                <TableCell>{row.original.nif}</TableCell>
                <TableCell>{row.original.minimumStock}</TableCell>
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
