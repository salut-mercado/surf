import type { SupplierReturnSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export const columns: ColumnDef<SupplierReturnSchema>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "agent", header: "Agent" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "nif", header: "Tax ID" },
  { accessorKey: "delayDays", header: "Delay Days" },
  { accessorKey: "blocked", header: "Blocked" },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="ghost">
          <Link href={`/${row.original.id}`}>
            View <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];
