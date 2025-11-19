import type {
  OrderInflowApiCreateOrderInflowHandlerApiOrderInflowPostRequest,
  OrderInflowApiAddSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPostRequest,
  OrderInflowApiGetOrderInflowHandlerApiOrderInflowGetRequest,
  OrderInflowApiGetOrderInflowByIdHandlerApiOrderInflowSkuOrderInflowIdGetRequest,
  OrderInflowUpdateScheme,
} from "@salut-mercado/octo-client";
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "~/lib/api";

export const inflows = {
  // Queries
  useGetAll: (
    args:
      | Omit<OrderInflowApiGetOrderInflowHandlerApiOrderInflowGetRequest, "skip">
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["inflows", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.inflows
                .getOrderInflowHandlerApiOrderInflowGet(args)
                .then((res) => res.data)
          : skipToken,
    }),
  useGetById: (
    args:
      | OrderInflowApiGetOrderInflowByIdHandlerApiOrderInflowSkuOrderInflowIdGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["inflows", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.inflows
                .getOrderInflowByIdHandlerApiOrderInflowSkuOrderInflowIdGet(
                  { id: args.id }
                )
                .then((res) => res.data)
          : skipToken,
    }),

  // Mutations
  useCreate: () =>
    useMutation({
      mutationKey: ["inflows", "create"],
      mutationFn: (
        args: OrderInflowApiCreateOrderInflowHandlerApiOrderInflowPostRequest
      ) => api.inflows.createOrderInflowHandlerApiOrderInflowPost(args),
    }),
  useAddSkuItems: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["inflows", "addSkuItems"],
      mutationFn: ({
        orderInflowId,
        items,
      }: {
        orderInflowId: OrderInflowApiAddSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPostRequest["orderInflowId"];
        items: OrderInflowApiAddSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPostRequest["sKUOrderInflowScheme"];
      }) =>
        api.inflows.addSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPost({
          orderInflowId,
          sKUOrderInflowScheme: items,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["inflows"],
        });
      },
    });
  },
  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["inflows", "update"],
      mutationFn: ({
        id,
        orderInflowUpdateScheme,
      }: {
        id: string;
        orderInflowUpdateScheme: OrderInflowUpdateScheme;
      }) => {
        // Note: Method name may need adjustment after OpenAPI client regeneration
        // Expected: updateOrderInflowHandlerApiOrderInflowInflowIdPatch
        return (api.inflows as any).updateOrderInflowHandlerApiOrderInflowInflowIdPatch({
          inflowId: id,
          orderInflowUpdateScheme,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["inflows"],
        });
      },
    });
  },
  useDeleteSkuItem: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["inflows", "deleteSkuItem"],
      mutationFn: ({
        orderInflowId,
        skuId,
      }: {
        orderInflowId: string;
        skuId: string;
      }) => {
        // Note: Method name may need adjustment after OpenAPI client regeneration
        // Expected: deleteSkuOrderInflowHandlerApiOrderInflowOrderInflowIdSkuIdDelete
        return (api.inflows as any).deleteSkuOrderInflowHandlerApiOrderInflowOrderInflowIdSkuIdDelete({
          orderInflowId,
          skuId,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["inflows"],
        });
      },
    });
  },
};
