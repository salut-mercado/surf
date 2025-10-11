import type {
  AddSupplierHandlerApiSuppliersPostRequest,
  GetSupplierHandlerApiSuppliersGetRequest,
  GetSupplierHandlerApiSuppliersIdGetRequest,
  SupplierPaginatedResponseSchema,
  UpdateSupplerHandlerApiSuppliersIdPutRequest,
} from "@salut-mercado/octo-client";
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  skipToken,
} from "@tanstack/react-query";
import { api } from "~/lib/api";

export const suppliers = {
  // Queries
  useGetAll: (
    args:
      | Omit<GetSupplierHandlerApiSuppliersGetRequest, "skip">
      | typeof skipToken
  ) =>
    useInfiniteQuery({
      getNextPageParam: (lastPage: SupplierPaginatedResponseSchema) =>
        (lastPage.skip ?? 0) + (lastPage.limit ?? 0),
      initialPageParam: 0,
      queryKey: ["suppliers", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? ({ pageParam }) =>
              api.suppliers.getSupplierHandlerApiSuppliersGet({
                ...args,
                skip: pageParam,
                limit: args.limit ?? 10,
              })
          : skipToken,
    }),
  useGetById: (
    args: GetSupplierHandlerApiSuppliersIdGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["suppliers", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.suppliers.getSupplierHandlerApiSuppliersIdGet(args)
          : skipToken,
    }),

  // Mutations
  useCreate: () =>
    useMutation({
      mutationKey: ["suppliers", "create"],
      mutationFn: (args: AddSupplierHandlerApiSuppliersPostRequest) =>
        api.suppliers.addSupplierHandlerApiSuppliersPost(args),
    }),
  useUpdate: () =>
    useMutation({
      mutationKey: ["suppliers", "update"],
      mutationFn: (args: UpdateSupplerHandlerApiSuppliersIdPutRequest) =>
        api.suppliers.updateSupplerHandlerApiSuppliersIdPut(args),
    }),
};
