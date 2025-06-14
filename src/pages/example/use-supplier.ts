import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { GetSuppliersApiSuppliersGetRequest } from "@salut-mercado/octo-client";

export const useSupplier = (params: GetSuppliersApiSuppliersGetRequest) => {
    return useQuery({
        queryKey: ["supplier", JSON.stringify(params)],
        queryFn: () => api.suppliers.getSuppliersApiSuppliersGet(params),
    });
};
