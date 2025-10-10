import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api.ts";
import type { UpdateCategoryHandlerApiCategoriesCategoriesIdPutRequest } from "@salut-mercado/octo-client";

export const useUpdateCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: UpdateCategoryHandlerApiCategoriesCategoriesIdPutRequest
    ) => api.categories.updateCategoryHandlerApiCategoriesCategoriesIdPut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
