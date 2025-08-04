import {useMutation} from "@tanstack/react-query";
import type {AddSkuHandlerApiSkusPostRequest} from "@salut-mercado/octo-client";
import {api} from "~/lib/api.ts";

export const useCreateSku = () => {
    return useMutation({
        mutationFn: (data: AddSkuHandlerApiSkusPostRequest) =>
            api.sku.addSkuHandlerApiSkusPost(data),
    });
};