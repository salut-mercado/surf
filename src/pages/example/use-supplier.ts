import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { GetSupplierHandlerApiSuppliersGet0Request } from "@salut-mercado/octo-client";

export const useSupplier = (params: GetSupplierHandlerApiSuppliersGet0Request) => {
    return useQuery({
        queryKey: ["supplier", JSON.stringify(params)],
        queryFn: () => api.suppliers.getSupplierHandlerApiSuppliersGet(params),
    });
};
