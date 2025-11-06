import type {
  WarehouseApiAddWarehouseHandlerApiWarehousePostRequest,
  WarehouseApiGetWarehouseByIdHandlerApiWarehouseIdGetRequest,
  WarehouseApiGetWarehousesHandlerApiWarehouseGetRequest,
  WarehouseApiUpdateWarehouseHandlerApiWarehouseIdPutRequest,
  WareHousePaginatedResponseSchema
} from "@salut-mercado/octo-client";
import {
  skipToken,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "~/lib/api";

export const warehouse = {
  // Queries
  useGetAll: (
    args:
      | Omit<WarehouseApiGetWarehousesHandlerApiWarehouseGetRequest, "skip">
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
              .then((res) => res.data)
          : skipToken,
    }),
  useGetById: (
    args: WarehouseApiGetWarehouseByIdHandlerApiWarehouseIdGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["warehouse", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.warehouse.getWarehouseByIdHandlerApiWarehouseIdGet(args)
          : skipToken,
    }),

  // Mutations
  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["warehouse", "create"],
      mutationFn: (args: WarehouseApiAddWarehouseHandlerApiWarehousePostRequest) =>
        api.warehouse.addWarehouseHandlerApiWarehousePost(args),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["warehouse", "getAll"],
        });
      },
    });
  },
  useUpdate: () =>
    useMutation({
      mutationKey: ["warehouse", "update"],
      mutationFn: (args: WarehouseApiUpdateWarehouseHandlerApiWarehouseIdPutRequest) =>
        api.warehouse.updateWarehouseHandlerApiWarehouseIdPut(args),
    }),
};
