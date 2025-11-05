import type {
  AddSkuHandlerApiSkusPostRequest,
  GetSkuHandlerApiSkusIdGetRequest,
  GetSkusHandlerApiSkusGetRequest,
  SKUPaginatedResponseSchema,
  SKUReturnSchema,
  UpdateSkuHandlerApiSkusIdPutRequest,
} from "@salut-mercado/octo-client";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const skus = {
  // Queries
  useGetAll: (
    args: Omit<GetSkusHandlerApiSkusGetRequest, "skip"> | typeof skipToken
  ) =>
    useQuery<SKUPaginatedResponseSchema>({
      queryKey: ["skus", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.sku.getSkusHandlerApiSkusGet(args)
          : skipToken,
    }),
  useGetById: (args: GetSkuHandlerApiSkusIdGetRequest | typeof skipToken) =>
    useQuery<SKUReturnSchema>({
      queryKey: ["skus", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.sku.getSkuHandlerApiSkusIdGet(args)
          : skipToken,
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
