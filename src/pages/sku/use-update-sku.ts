import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api.ts";
import type {
    UpdateSkuApiSkuSkuIdPutRequest,
} from "@salut-mercado/octo-client";

export const useUpdateSku = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSkuApiSkuSkuIdPutRequest) =>
            api.sku.updateSkuApiSkuSkuIdPut(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sku"] });
        },
    });
};