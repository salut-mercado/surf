import type {
  GetWarehousesHandlerApiWarehouseGetRequest,
  WareHousePaginatedResponseSchema,
  AddWarehouseHandlerApiWarehousePostRequest,
  WareHouseReturnSchema,
  GetWarehouseByIdHandlerApiWarehouseIdGetRequest,
  UpdateWarehouseHandlerApiWarehouseIdPutRequest,
} from "@salut-mercado/octo-client";
import {
  skipToken,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { api } from "~/lib/api";

export const warehouse = {
  // Queries
  useGetAll: (
    args:
      | Omit<GetWarehousesHandlerApiWarehouseGetRequest, "skip">
      | typeof skipToken
  ) =>
    useInfiniteQuery({
      getNextPageParam: (lastPage: WareHousePaginatedResponseSchema) =>
        (lastPage.skip ?? 0) + (lastPage.limit ?? 0),
      initialPageParam: 0,
      queryKey: ["warehouse", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? ({ pageParam }) =>
              api.warehouse.getWarehousesHandlerApiWarehouseGet({
                ...args,
                skip: pageParam,
                limit: args.limit ?? 1000,
              })
          : skipToken,
    }),
  useGetById: (
    args: GetWarehouseByIdHandlerApiWarehouseIdGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["warehouse", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.warehouse.getWarehouseByIdHandlerApiWarehouseIdGet(args)
          : skipToken,
    }),

  // Mutations
  useCreate: () =>
    useMutation({
      mutationKey: ["warehouse", "create"],
      mutationFn: (args: AddWarehouseHandlerApiWarehousePostRequest) =>
        api.warehouse.addWarehouseHandlerApiWarehousePost(args),
    }),
  useUpdate: () =>
    useMutation({
      mutationKey: ["warehouse", "update"],
      mutationFn: (args: UpdateWarehouseHandlerApiWarehouseIdPutRequest) =>
        api.warehouse.updateWarehouseHandlerApiWarehouseIdPut(args),
    }),
};
