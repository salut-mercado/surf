import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { GetSuppliersDetailsApiSuppliersDetailsGetRequest } from "@salut-mercado/octo-client";

export const useSupplier = (params: GetSuppliersDetailsApiSuppliersDetailsGetRequest) => {
    return useQuery({
        queryKey: ["supplier", JSON.stringify(params)],
        queryFn: () => api.suppliersDetails.getSuppliersDetailsApiSuppliersDetailsGet(params),
    });
};
