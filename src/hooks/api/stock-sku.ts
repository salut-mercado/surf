import type {
  GetStockSkuApiStockSkuStockSkuGetRequest,
  SKUReturnSchema,
} from "@salut-mercado/octo-client";
import {
  skipToken,
  useQueries,
  useQuery,
  type QueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "~/lib/api";

export const stockSKU = {
  useGetStockSku: (
    args: GetStockSkuApiStockSkuStockSkuGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["stockSKU", "getStockSku", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.stockSKU
                .getStockSkuApiStockSkuStockSkuGet(args)
                .catch((err: AxiosError) => {
                  if (err.response?.status === 404) {
                    throw new Error("Not found");
                  }
                  throw err;
                })
          : skipToken,
      retry: (failureCount, error) => {
        if (error.message === "Not found") return false;
        return failureCount < 3;
      },
    }),

  useGetManyForWarehouse: (
    skus: SKUReturnSchema[],
    warehouseId?: string | null
  ) =>
    useQueries({
      queries:
        warehouseId && skus.length > 0
          ? skus.map(
              (sku) =>
                ({
                  queryKey: ["stockSKU", sku.barcode, warehouseId],
                  queryFn: () =>
                    api.stockSKU
                      .getStockSkuApiStockSkuStockSkuGet({
                        barcode: sku.barcode,
                        warehouseId,
                      })
                      .catch((err: AxiosError) => {
                        if (err.response?.status === 404) {
                          throw new Error("Not found");
                        }
                        throw err;
                      }),
                  retry: (failureCount, error) => {
                    if (error.message === "Not found") return false;
                    return failureCount < 3;
                  },
                }) satisfies QueryOptions
            )
          : [],
    }),
};
