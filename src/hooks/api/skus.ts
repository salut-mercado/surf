import type {
  SKUsApiGetSkusHandlerApiSkusGetRequest,
  SKUsApiGetSkuHandlerApiSkusIdGetRequest,
  SKUsApiAddSkuHandlerApiSkusPostRequest,
  SKUPaginatedResponseSchema,
  SKUReturnSchema,
  SKUsApiUpdateSkuHandlerApiSkusIdPutRequest,
} from "@salut-mercado/octo-client";
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "~/lib/api";

export const skus = {
  // Queries
  useGetAll: (
    args:
      | Omit<SKUsApiGetSkusHandlerApiSkusGetRequest, "skip">
      | typeof skipToken
  ) =>
    useQuery<SKUPaginatedResponseSchema>({
      queryKey: ["skus", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.sku.getSkusHandlerApiSkusGet(args).then((res) => res.data)
          : skipToken,
    }),
  useGetById: (
    args: SKUsApiGetSkuHandlerApiSkusIdGetRequest | typeof skipToken
  ) =>
    useQuery<SKUReturnSchema>({
      queryKey: ["skus", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.sku.getSkuHandlerApiSkusIdGet(args).then((res) => res.data)
          : skipToken,
    }),

  // Mutations
  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["skus", "create"],
      mutationFn: (args: SKUsApiAddSkuHandlerApiSkusPostRequest) =>
        api.sku.addSkuHandlerApiSkusPost(args),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["skus", "getAll"],
        });
      },
    });
  },
  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["skus", "update"],
      mutationFn: (args: SKUsApiUpdateSkuHandlerApiSkusIdPutRequest) =>
        api.sku.updateSkuHandlerApiSkusIdPut(args),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["skus", "getAll"],
        });
        queryClient.invalidateQueries({
          queryKey: ["skus", "getById", data.data.id],
        });
      },
    });
  },
};
