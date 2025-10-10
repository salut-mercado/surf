import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api.ts";
import type { GetSkusHandlerApiSkusGetRequest } from "@salut-mercado/octo-client";

export const useSku = (params: GetSkusHandlerApiSkusGetRequest) => {
  return useQuery({
    queryKey: ["sku", JSON.stringify(params)],
    queryFn: () => api.sku.getSkusHandlerApiSkusGet(params),
  });
};
