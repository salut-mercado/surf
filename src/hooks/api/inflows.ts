import type {
  OrderInflowApiCreateOrderInflowHandlerApiOrderInflowPostRequest,
  OrderInflowApiAddSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPostRequest,
} from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const inflows = {
  useCreate: () =>
    useMutation({
      mutationKey: ["inflows", "create"],
      mutationFn: (
        args: OrderInflowApiCreateOrderInflowHandlerApiOrderInflowPostRequest
      ) => api.inflows.createOrderInflowHandlerApiOrderInflowPost(args),
    }),
  useAddSkuItems: () =>
    useMutation({
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
    }),
};
