import type { InventoryApiGetStoreInventoryHandlerApiInventoryStoreIdGetRequest } from "@salut-mercado/octo-client";
import { skipToken, useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const inventory = {
  useGetInventory: (
    args:
      | InventoryApiGetStoreInventoryHandlerApiInventoryStoreIdGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["inventory", "getInventory"],
      queryFn:
        args !== skipToken
          ? () =>
              api.inventory
                .getStoreInventoryHandlerApiInventoryStoreIdGet(args)
                .then((res) => res.data)
          : skipToken,
    }),
};
