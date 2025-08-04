import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api.ts";
import type {
    UpdateSkuHandlerApiSkusIdPutRequest,
} from "@salut-mercado/octo-client";

export const useUpdateSku = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSkuHandlerApiSkusIdPutRequest) =>
            api.sku.updateSkuHandlerApiSkusIdPut(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sku"] });
        },
    });
};