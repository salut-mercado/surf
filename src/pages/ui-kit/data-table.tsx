import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { TranslatedColumnHeader } from "~/components/common/translated-column-header";
import { DataTable } from "~/components/composite/data-table";
import { useDataTable } from "~/components/composite/data-table/use-data-table";
import { Button } from "~/components/ui/button";

type Data = {
  id: string;
  name: string;
  age: number;
};

const columns: ColumnDef<Data>[] = [
  {
    header: () => (
      <TranslatedColumnHeader>{"skus.columns.name"}</TranslatedColumnHeader>
    ),
    accessorKey: "name",
  },
  {
    header: () => (
      <TranslatedColumnHeader>{"skus.columns.age"}</TranslatedColumnHeader>
    ),
    accessorKey: "age",
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => (
      <Button variant="ghost" onClick={() => console.log(row.original)}>
        Delete
      </Button>
    ),
  },
];

export const Table = () => {
  const [data, setData] = useState<Data[]>([]);
  const table = useDataTable({
    data,
    columns,
  });

  return (
    <div className="space-y-2">
      <DataTable table={table} />
      <div>
        <Button
          variant="outline"
          onClick={() =>
            setData([
              ...data,
              { id: crypto.randomUUID(), name: "John Doe", age: 20 },
            ])
          }
        >
          Add Row
        </Button>
      </div>
    </div>
  );
};
