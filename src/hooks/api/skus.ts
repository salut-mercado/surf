import type {
  SKUsApiGetSkusHandlerApiSkusGetRequest,
  SKUsApiGetSkuHandlerApiSkusIdGetRequest,
  SKUsApiAddSkuHandlerApiSkusPostRequest,
  SKUPaginatedResponseSchema,
  SKUReturnSchema,
  SKUsApiUpdateSkuHandlerApiSkusIdPutRequest,
} from "@salut-mercado/octo-client";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
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
  useCreate: () =>
    useMutation({
      mutationKey: ["skus", "create"],
      mutationFn: (args: SKUsApiAddSkuHandlerApiSkusPostRequest) =>
        api.sku.addSkuHandlerApiSkusPost(args),
    }),
  useUpdate: () =>
    useMutation({
      mutationKey: ["skus", "update"],
      mutationFn: (args: SKUsApiUpdateSkuHandlerApiSkusIdPutRequest) =>
        api.sku.updateSkuHandlerApiSkusIdPut(args),
    }),
};
