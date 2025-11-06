import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type TableOptions,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export type UseDataTableOptions<TData, TColumnDef extends ColumnDef<TData>> = {
  data: TData[];
  columns: TColumnDef[];
  pagination?: PaginationOptions;
  filter?: FilterOptions;
};

export type UseDataTableResult<TData> = {
  table: TanstackTable<TData>;
  pageSizes: number[];
};

const DEFAULT_PAGE_SIZES = [10, 50, 100, 500];

export function useDataTable<TData, TColumnDef extends ColumnDef<TData>>({
  data,
  columns,
  pagination,
  filter,
}: UseDataTableOptions<TData, TColumnDef>): UseDataTableResult<TData> {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string | undefined>("");

  const paginationMemo = useMemo(() => {
    if (!pagination)
      return {
        pageSizes: DEFAULT_PAGE_SIZES,
        disabled: false,
      };
    if ("disabled" in pagination)
      return {
        disabled: true,
      };
    return {
      pageSizes: pagination.pageSizes ?? DEFAULT_PAGE_SIZES,
      disabled: false as const,
    };
  }, [pagination]);

  const filterMemo = useMemo(() => {
    if (!filter) return { disabled: false };
    if ("disabled" in filter) {
      return {
        disabled: true as const,
      };
    }
    return {
      disabled: false as const,
    };
  }, [filter]);

  const options = useMemo(() => {
    const options: TableOptions<TData> = {
      data: data ?? [],
      columns: columns,
      getCoreRowModel: getCoreRowModel(),
    };
    if (!paginationMemo.disabled) {
      const pageSizes = paginationMemo.pageSizes;
      options.getPaginationRowModel = getPaginationRowModel();
      options.initialState = {
        ...options.initialState,
        pagination: {
          ...options.initialState?.pagination,
          pageSize: pageSizes?.[0] ?? DEFAULT_PAGE_SIZES[0],
        },
      };
    }

    if (!filterMemo.disabled) {
      options.getFilteredRowModel = getFilteredRowModel();
      options.onColumnFiltersChange = setColumnFilters;
      options.onGlobalFilterChange = setGlobalFilter;
      options.state = {
        ...options.state,
        columnFilters,
        globalFilter,
      };
    }
    return options;
  }, [data, columns, paginationMemo, filterMemo, columnFilters, globalFilter]);

  const table = useReactTable(options);

  return { table, pageSizes: paginationMemo.pageSizes ?? DEFAULT_PAGE_SIZES };
}

type PaginationOptions =
  | {
      disabled: true;
    }
  | {
      pageSizes?: number[];
    };

type FilterOptions = {
  disabled: true;
};
