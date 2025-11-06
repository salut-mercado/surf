import type {
  StoresApiAddStoreHandlerApiStoresPostRequest,
  StoresApiGetStoreHandlerApiStoresIdGetRequest,
  StoresApiGetStoresHandlerApiStoresGetRequest,
  StorePaginatedResponseSchema,
  StoresApiUpdateStoreHandlerApiStoresIdPutRequest,
} from "@salut-mercado/octo-client";
import {
  skipToken,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "~/lib/api";

export const stores = {
  // Queries
  useGetAll: (
    args:
      | Omit<StoresApiGetStoresHandlerApiStoresGetRequest, "skip">
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
              api.stores
                .getStoresHandlerApiStoresGet({
                  ...args,
                  skip: pageParam,
                  limit: args.limit ?? 1000,
                })
                .then((res) => res.data)
          : skipToken,
    }),
  useGetById: (
    args: StoresApiGetStoreHandlerApiStoresIdGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["stores", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.stores
                .getStoreHandlerApiStoresIdGet(args)
                .then((res) => res.data)
          : skipToken,
    }),

  // Mutations
  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["stores", "create"],
      mutationFn: (args: StoresApiAddStoreHandlerApiStoresPostRequest) =>
        api.stores.addStoreHandlerApiStoresPost(args),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["stores", "getAll"],
        });
      },
    });
  },
  useUpdate: () =>
    useMutation({
      mutationKey: ["stores", "update"],
      mutationFn: (args: StoresApiUpdateStoreHandlerApiStoresIdPutRequest) =>
        api.stores.updateStoreHandlerApiStoresIdPut(args),
    }),
};
