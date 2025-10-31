import type {
  CreateOrderInflowApiOrderInflowPostRequest,
  OrderInflowBaseReturnScheme,
  AddSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPostRequest,
  SKUOrderInflowScheme,
} from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const inflows = {
  useCreate: () =>
    useMutation({
      mutationKey: ["inflows", "create"],
      mutationFn: (args: CreateOrderInflowApiOrderInflowPostRequest) =>
        api.inflows.createOrderInflowApiOrderInflowPost(args),
    }),
  useAddSkuItems: () =>
    useMutation({
      mutationKey: ["inflows", "addSkuItems"],
      mutationFn: ({
        orderInflowId,
        items,
      }: {
        orderInflowId: string;
        items: SKUOrderInflowScheme[];
      }) =>
        api.inflows.addSkuOrderInflowHandlerApiOrderInflowSkuOrderInflowPost(
          { orderInflowId },
          items
        ),
    }),
};
