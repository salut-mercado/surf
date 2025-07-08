import {useQuery} from "@tanstack/react-query";
import {api} from "~/lib/api.ts";
import type {GetSkusApiSkuGetRequest} from "@salut-mercado/octo-client";

export const useSku = (params: GetSkusApiSkuGetRequest) => {
    return useQuery({
        queryKey: ["sku", JSON.stringify(params)],
        queryFn: () => api.sku.getSkusApiSkuGet(params),
    });
};