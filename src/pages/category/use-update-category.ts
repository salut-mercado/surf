import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api.ts";
import type {
    UpdateCategoryHandlerApiCategoriesIdPutRequest,
} from "~/lib/.generated/client";

export const useUpdateCategories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateCategoryHandlerApiCategoriesIdPutRequest) =>
            api.categories.updateCategoryHandlerApiCategoriesIdPut(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};