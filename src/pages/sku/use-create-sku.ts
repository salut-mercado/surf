import {useMutation} from "@tanstack/react-query";
import type {CreateSkuApiSkuPostRequest} from "@salut-mercado/octo-client";
import {api} from "~/lib/api.ts";

export const useCreateSku = () => {
    return useMutation({
        mutationFn: (data: CreateSkuApiSkuPostRequest) =>
            api.sku.createSkuApiSkuPost(data),
    });
};