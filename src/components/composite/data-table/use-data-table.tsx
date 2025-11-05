import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type TableOptions,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export type UseDataTableOptions<TData, TColumnDef extends ColumnDef<TData>> = {
  data: TData[];
  columns: TColumnDef[];
  pagination?: PaginationOptions;
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
}: UseDataTableOptions<TData, TColumnDef>): UseDataTableResult<TData> {
  const paginationMemo = useMemo(() => {
    if (!pagination)
      return {
        pageSizes: DEFAULT_PAGE_SIZES,
      };
    if ("disabled" in pagination)
      return {
        disabled: true,
      };
    return {
      pageSizes: pagination.pageSizes ?? DEFAULT_PAGE_SIZES,
    };
  }, [pagination]);

  const options = useMemo(() => {
    const options: TableOptions<TData> = {
      data: data ?? [],
      columns: columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    };
    if (!("disabled" in paginationMemo)) {
      const pageSizes = paginationMemo.pageSizes;
      options.getPaginationRowModel = getPaginationRowModel();
      options.initialState = {
        ...options.initialState,
        pagination: {
          ...options.initialState?.pagination,
          pageSize: pageSizes[0],
        },
      };
    }

    return options;
  }, [data, columns, paginationMemo]);

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
