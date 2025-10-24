import type {
  AddSupplierHandlerApiSuppliersPostRequest,
  GetSupplierBankInfoHandlerApiSuppliersBankInfoIdGetRequest,
  GetSupplierByIdHandlerApiSuppliersIdGetRequest,
  GetSupplierHandlerApiSuppliersGetRequest,
  GetSuppliersBankInfoHandlerApiSuppliersBankInfoGetRequest,
  SupplierBankInfoPaginatedResponseSchema,
  SupplierBankInfoReturnSchema,
  SupplierBankInfoSchema,
  SupplierBankInfoUpdateSchema,
  SupplierPaginatedResponseSchema,
  UpdateSupplierHandlerApiSuppliersIdPutRequest,
} from "@salut-mercado/octo-client";
import {
  skipToken,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
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
    args: GetSupplierByIdHandlerApiSuppliersIdGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["suppliers", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.suppliers.getSupplierByIdHandlerApiSuppliersIdGet(args)
          : skipToken,
    }),
  useBankingInfo: (
    args:
      | GetSupplierBankInfoHandlerApiSuppliersBankInfoIdGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["suppliers", "bankingInfo", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.suppliers.getSupplierBankInfoHandlerApiSuppliersBankInfoIdGet(
                args
              )
          : skipToken,
    }),

  useBankingList: (
    args:
      | GetSuppliersBankInfoHandlerApiSuppliersBankInfoGetRequest
      | typeof skipToken
  ) =>
    useQuery<SupplierBankInfoPaginatedResponseSchema>({
      queryKey: ["suppliers", "bankingList", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.suppliers.getSuppliersBankInfoHandlerApiSuppliersBankInfoGet(
                args
              )
          : skipToken,
      enabled: args !== skipToken,
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
      mutationFn: (args: UpdateSupplierHandlerApiSuppliersIdPutRequest) =>
        api.suppliers.updateSupplierHandlerApiSuppliersIdPut(args),
    }),

  useCreateBankInfo: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["suppliers", "banking", "create"],
      mutationFn: (args: { supplierBankInfoSchema: SupplierBankInfoSchema }) =>
        api.suppliers.addSupplierBankInfoHandlerApiSuppliersBankInfoPost(args),
      onSuccess: (created: SupplierBankInfoReturnSchema) => {
        // Invalidate lists and the specific bank info
        queryClient.invalidateQueries({
          queryKey: ["suppliers", "bankingList"],
        });
        if (created?.id) {
          queryClient.invalidateQueries({
            queryKey: [
              "suppliers",
              "bankingInfo",
              JSON.stringify({ id: created.id }),
            ],
          });
        }
      },
    });
  },

  useUpdateBankInfo: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["suppliers", "banking", "update"],
      mutationFn: (args: {
        id: string;
        supplierBankInfoUpdateSchema: SupplierBankInfoUpdateSchema;
      }) =>
        api.suppliers.updateSupplierBankInfoHandlerApiSuppliersBankInfoIdPut(
          args
        ),
      onSuccess: (updated: SupplierBankInfoReturnSchema) => {
        queryClient.invalidateQueries({
          queryKey: ["suppliers", "bankingList"],
        });
        if (updated?.id) {
          queryClient.invalidateQueries({
            queryKey: [
              "suppliers",
              "bankingInfo",
              JSON.stringify({ id: updated.id }),
            ],
          });
        }
      },
    });
  },
};
