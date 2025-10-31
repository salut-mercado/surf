import type { GetStoresHandlerApiStoresGetRequest } from "@salut-mercado/octo-client";
import { skipToken, useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const stores = {
  useGetAll: (args: GetStoresHandlerApiStoresGetRequest | typeof skipToken) => {
    return useQuery({
      queryKey: ["stores", "getAll"],
      queryFn:
        args !== skipToken
          ? () => api.stores.getStoresHandlerApiStoresGet(args)
          : skipToken,
    });
  },
};
