import type {
  SuppliersApiGetSuppliersBankInfoHandlerApiSuppliersBankInfoGetRequest,
  SuppliersApiGetSupplierBankInfoHandlerApiSuppliersBankInfoIdGetRequest,
  SuppliersApiGetSupplierByIdHandlerApiSuppliersIdGetRequest,
  SuppliersApiGetSupplierHandlerApiSuppliersGetRequest,
  SupplierPaginatedResponseSchema,
  SuppliersApiAddSupplierHandlerApiSuppliersPostRequest,
  SuppliersApiUpdateSupplierHandlerApiSuppliersIdPutRequest,
  SuppliersApiUpdateSupplierBankInfoHandlerApiSuppliersBankInfoIdPutRequest,
  SuppliersApiAddSupplierBankInfoHandlerApiSuppliersBankInfoPostRequest,
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
      | Omit<SuppliersApiGetSupplierHandlerApiSuppliersGetRequest, "skip">
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
              api.suppliers
                .getSupplierHandlerApiSuppliersGet({
                  ...args,
                  skip: pageParam,
                  limit: args.limit ?? 10,
                })
                .then((res) => res.data)
          : skipToken,
    }),
  useGetById: (
    args:
      | SuppliersApiGetSupplierByIdHandlerApiSuppliersIdGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["suppliers", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.suppliers
                .getSupplierByIdHandlerApiSuppliersIdGet(args)
                .then((res) => res.data)
          : skipToken,
    }),
  useBankingInfo: (
    args:
      | SuppliersApiGetSupplierBankInfoHandlerApiSuppliersBankInfoIdGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["suppliers", "bankingInfo", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.suppliers
                .getSupplierBankInfoHandlerApiSuppliersBankInfoIdGet(args)
                .then((res) => res.data)
          : skipToken,
    }),

  useBankingList: (
    args:
      | SuppliersApiGetSuppliersBankInfoHandlerApiSuppliersBankInfoGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["suppliers", "bankingList", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.suppliers
                .getSuppliersBankInfoHandlerApiSuppliersBankInfoGet(args)
                .then((res) => res.data)
          : skipToken,
      enabled: args !== skipToken,
    }),

  // Mutations
  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["suppliers", "create"],
      mutationFn: (
        args: SuppliersApiAddSupplierHandlerApiSuppliersPostRequest
      ) => api.suppliers.addSupplierHandlerApiSuppliersPost(args),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["suppliers", "getAll"],
        });
      },
    });
  },
  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["suppliers", "update"],
      mutationFn: (
        args: SuppliersApiUpdateSupplierHandlerApiSuppliersIdPutRequest
      ) => api.suppliers.updateSupplierHandlerApiSuppliersIdPut(args),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["suppliers", "getAll"],
        });
        queryClient.invalidateQueries({
          queryKey: ["suppliers", "getById", data.data.id],
        });
      },
    });
  },

  useCreateBankInfo: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["suppliers", "banking", "create"],
      mutationFn: (
        args: SuppliersApiAddSupplierBankInfoHandlerApiSuppliersBankInfoPostRequest
      ) =>
        api.suppliers
          .addSupplierBankInfoHandlerApiSuppliersBankInfoPost(args)
          .then((res) => res.data),
      onSuccess: (created) => {
        // Invalidate lists and the specific bank info
        queryClient.invalidateQueries({
          queryKey: ["suppliers", "bankingList"],
        });
        if (created.id) {
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
      mutationFn: (
        args: SuppliersApiUpdateSupplierBankInfoHandlerApiSuppliersBankInfoIdPutRequest
      ) =>
        api.suppliers
          .updateSupplierBankInfoHandlerApiSuppliersBankInfoIdPut(args)
          .then((res) => res.data),
      onSuccess: (updated) => {
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
