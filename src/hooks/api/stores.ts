import type {
  AddStoreHandlerApiStoresPostRequest,
  GetStoreHandlerApiStoresIdGetRequest,
  GetStoresHandlerApiStoresGetRequest,
  StorePaginatedResponseSchema,
  UpdateStoreHandlerApiStoresIdPutRequest,
} from "@salut-mercado/octo-client";
import {
  skipToken,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { api } from "~/lib/api";

export const stores = {
  // Queries
  useGetAll: (
    args:
      | Omit<GetStoresHandlerApiStoresGetRequest, "skip">
      | typeof skipToken
  ) =>
    useInfiniteQuery({
      getNextPageParam: (lastPage: StorePaginatedResponseSchema) =>
        (lastPage.skip ?? 0) + (lastPage.limit ?? 0),
      initialPageParam: 0,
      queryKey: ["stores", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? ({ pageParam }) =>
              api.stores.getStoresHandlerApiStoresGet({
                ...args,
                skip: pageParam,
                limit: args.limit ?? 1000,
              })
          : skipToken,
    }),
  useGetById: (
    args: GetStoreHandlerApiStoresIdGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["stores", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.stores.getStoreHandlerApiStoresIdGet(args)
          : skipToken,
    }),

  // Mutations
  useCreate: () =>
    useMutation({
      mutationKey: ["stores", "create"],
      mutationFn: (args: AddStoreHandlerApiStoresPostRequest) =>
        api.stores.addStoreHandlerApiStoresPost(args),
    }),
  useUpdate: () =>
    useMutation({
      mutationKey: ["stores", "update"],
      mutationFn: (args: UpdateStoreHandlerApiStoresIdPutRequest) =>
        api.stores.updateStoreHandlerApiStoresIdPut(args),
    }),
};
