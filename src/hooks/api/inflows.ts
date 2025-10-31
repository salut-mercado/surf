import type {
  AddSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPostRequest,
  CreateOrderInflowHandlerApiOrderInflowPostRequest,
} from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const inflows = {
  useCreate: () =>
    useMutation({
      mutationKey: ["inflows", "create"],
      mutationFn: (args: CreateOrderInflowHandlerApiOrderInflowPostRequest) =>
        api.inflows.createOrderInflowHandlerApiOrderInflowPost(args),
    }),
  useAddSkuItems: () =>
    useMutation({
      mutationKey: ["inflows", "addSkuItems"],
      mutationFn: ({
        orderInflowId,
        items,
      }: {
        orderInflowId: AddSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPostRequest["orderInflowId"];
        items: AddSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPostRequest["sKUOrderInflowScheme"];
      }) =>
        api.inflows.addSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPost({
          orderInflowId,
          sKUOrderInflowScheme: items,
        }),
    }),
};
