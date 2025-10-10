import { api } from "~/lib/api.ts";
import type { CreateCategoryHandlerApiCategoriesPostRequest } from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";

export const useCreateCategories = () => {
  return useMutation({
    mutationFn: (data: CreateCategoryHandlerApiCategoriesPostRequest) =>
      api.categories.createCategoryHandlerApiCategoriesPost(data),
  });
};
