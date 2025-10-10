import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api.ts";
import type { UpdateSupplerHandlerApiSuppliersIdPutRequest } from "@salut-mercado/octo-client";

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSupplerHandlerApiSuppliersIdPutRequest) =>
      api.suppliers.updateSupplerHandlerApiSuppliersIdPut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
