import { api } from "~/lib/api";
import type { GetSupplierHandlerApiSuppliersGetRequest } from "@salut-mercado/octo-client";
import { useQuery } from "@tanstack/react-query";

export const useSuppliers = (
  params: GetSupplierHandlerApiSuppliersGetRequest
) => {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => api.suppliers.getSupplierHandlerApiSuppliersGet(params),
  });
};
