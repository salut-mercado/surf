import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, /*Trash2*/ } from "lucide-react";
import type { SuppliersSchema } from "@salut-mercado/octo-client";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface SuppliersTableProps {
  suppliers: SuppliersSchema[];
  onToggleAnalytics: (code: string, checked: boolean) => void;
  onToggleBlocked: (code: string, checked: boolean) => void;
  onEdit?: (supplier: SuppliersSchema) => void;
  onDelete?: (code: string) => void;
}

export function SuppliersTable({ suppliers, onToggleAnalytics, onToggleBlocked, onEdit, /*onDelete*/ }: SuppliersTableProps) {
  const table = useReactTable({
    data: suppliers,
    columns: [
      { accessorKey: "code", header: "Code" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "agent", header: "Agent" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "taxID", header: "Tax ID" },
      { accessorKey: "delayDays", header: "Delay Days" },
      { accessorKey: "analytics", header: "Analytics" },
      { accessorKey: "blocked", header: "Blocked" },
      { accessorKey: "comments", header: "Comments" },
      { 
        id: "actions", 
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {/* <DropdownMenuItem 
                onClick={() => onDelete?.(row.original.code)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        )
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Tax ID</TableHead>
              <TableHead>Delay Days</TableHead>
              <TableHead>Analytics</TableHead>
              <TableHead>Blocked</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.original.code}>
                <TableCell>{row.original.code}</TableCell>
                <TableCell>{row.original.name}</TableCell>
                <TableCell>{row.original.agent}</TableCell>
                <TableCell>{row.original.phone}</TableCell>
                <TableCell>{row.original.taxID}</TableCell>
                <TableCell>{row.original.delayDays}</TableCell>
                <TableCell>
                  <Switch
                    checked={row.original.analytics}
                    onCheckedChange={(checked) => onToggleAnalytics(row.original.code, checked)}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={row.original.blocked}
                    onCheckedChange={(checked) => onToggleBlocked(row.original.code, checked)}
                  />
                </TableCell>
                <TableCell>{row.original.comments}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem 
                        onClick={() => onDelete?.(row.original.code)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
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