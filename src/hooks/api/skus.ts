import type {
  AddSkuHandlerApiSkusPostRequest,
  GetSkuHandlerApiSkusIdGetRequest,
  GetSkusHandlerApiSkusGetRequest,
  SKUPaginatedResponseSchema,
  SKUReturnSchema,
  UpdateSkuHandlerApiSkusIdPutRequest,
} from "@salut-mercado/octo-client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  skipToken,
} from "@tanstack/react-query";
import { api } from "~/lib/api";

export const skus = {
  // Queries
  useGetAll: (
    args: Omit<GetSkusHandlerApiSkusGetRequest, "skip"> | typeof skipToken
  ) =>
    useInfiniteQuery<SKUPaginatedResponseSchema>({
      getNextPageParam: (lastPage: SKUPaginatedResponseSchema) => {
        if (lastPage.items.length < (lastPage.limit ?? 1)) {
          return undefined;
        }
        return (lastPage.skip ?? 0) + (lastPage.limit ?? 0);
      },
      initialPageParam: 0,
      queryKey: ["skus", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? ({ pageParam }) =>
              api.sku.getSkusHandlerApiSkusGet({
                ...(args as GetSkusHandlerApiSkusGetRequest),
                skip: pageParam as number,
                limit: (args as GetSkusHandlerApiSkusGetRequest).limit ?? 10,
              })
          : (skipToken as unknown as () => Promise<SKUPaginatedResponseSchema>),
    }),
  useGetById: (args: GetSkuHandlerApiSkusIdGetRequest | typeof skipToken) =>
    useQuery<SKUReturnSchema>({
      queryKey: ["skus", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.sku.getSkuHandlerApiSkusIdGet(args)
          : (skipToken as unknown as () => Promise<SKUReturnSchema>),
    }),

  // Mutations
  useCreate: () =>
    useMutation({
      mutationKey: ["skus", "create"],
      mutationFn: (args: AddSkuHandlerApiSkusPostRequest) =>
        api.sku.addSkuHandlerApiSkusPost(args),
    }),
  useUpdate: () =>
    useMutation({
      mutationKey: ["skus", "update"],
      mutationFn: (args: UpdateSkuHandlerApiSkusIdPutRequest) =>
        api.sku.updateSkuHandlerApiSkusIdPut(args),
    }),
};
