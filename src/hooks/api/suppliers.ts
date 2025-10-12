import type {
  AddSupplierHandlerApiSuppliersPostRequest,
  GetSupplierBankInfoNandlerApiContractorBankInfoIdGetRequest,
  GetSuppliersBankInfoNandlerApiContractorBankInfoGetRequest,
  SupplierBankInfoPaginatedResponseSchema,
  SupplierBankInfoReturnSchema,
  SupplierBankInfoSchema,
  SupplierBankInfoUpdateSchema,
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
    args: GetSupplierHandlerApiSuppliersIdGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["suppliers", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.suppliers.getSupplierHandlerApiSuppliersIdGet(args)
          : skipToken,
    }),
  useBankingInfo: (
    args:
      | GetSupplierBankInfoNandlerApiContractorBankInfoIdGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["suppliers", "bankingInfo", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.suppliersBankInfo.getSupplierBankInfoNandlerApiContractorBankInfoIdGet(
                args
              )
          : skipToken,
    }),

  useBankingList: (
    args:
      | GetSuppliersBankInfoNandlerApiContractorBankInfoGetRequest
      | typeof skipToken
  ) =>
    useQuery<SupplierBankInfoPaginatedResponseSchema>({
      queryKey: ["suppliers", "bankingList", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.suppliersBankInfo.getSuppliersBankInfoNandlerApiContractorBankInfoGet(
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
      mutationFn: (args: UpdateSupplerHandlerApiSuppliersIdPutRequest) =>
        api.suppliers.updateSupplerHandlerApiSuppliersIdPut(args),
    }),

  useCreateBankInfo: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["suppliers", "banking", "create"],
      mutationFn: (args: { supplierBankInfoSchema: SupplierBankInfoSchema }) =>
        api.suppliersBankInfo.addSupplierBankInfoNandlerApiContractorBankInfoPost(
          args
        ),
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
        api.suppliersBankInfo.updateSupplerBankInfoApiContractorBankInfoIdPut(
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
