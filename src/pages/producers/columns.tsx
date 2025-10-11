import type { FirmsProducerSchema } from "@salut-mercado/octo-client";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export const columns: ColumnDef<FirmsProducerSchema & { id: string }>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "nif", header: "Tax ID" },
  { accessorKey: "minimumStock", header: "Minimum Stock" },
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
