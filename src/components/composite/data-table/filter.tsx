import { IconCheck, IconFilter, IconSearch } from "@tabler/icons-react";
import { flexRender } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import type { UseDataTableResult } from "./use-data-table";

export function DataTableFilter<TData>({
  table,
}: {
  table: UseDataTableResult<TData>["table"];
}) {
  const { t } = useTranslation();
  const headers = table
    .getHeaderGroups()
    .map((headerGroup) =>
      headerGroup.headers.map((header) => {
        if (header.isPlaceholder) return null;
        if (!header.column.getCanFilter()) {
          return null;
        }
        return {
          label: flexRender(
            header.column.columnDef.header,
            header.getContext()
          ),
          value: header.id,
        };
      })
    )
    .flat()
    .filter((header) => header !== null);

  const [filter, setFilter] = useState<string>("");
  const [filterColumn, setFilterColumn] = useState<string | null>(null);

  useEffect(() => {
    if (filterColumn) {
      table.setGlobalFilter(undefined);
      table.setColumnFilters([{ id: filterColumn, value: filter }]);
    } else {
      table.setGlobalFilter(filter);
      table.setColumnFilters([]);
    }
  }, [filterColumn, filter, table]);

  return (
    <div>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          placeholder={t("dataTable.filter.placeholder")}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                aria-label={t("dataTable.filter.moreOptions")}
                size="icon-xs"
              >
                <IconFilter className="size-4" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {headers.map((header) => {
                return (
                  <DropdownMenuItem
                    key={header.value}
                    onClick={() =>
                      setFilterColumn((curr) =>
                        curr === header.value ? null : header.value
                      )
                    }
                  >
                    {header.label}{" "}
                    {filterColumn === header.value ? (
                      <IconCheck className="size-4 ml-auto" />
                    ) : null}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
