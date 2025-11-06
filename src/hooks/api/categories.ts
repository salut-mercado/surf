import type {
  CategoriesApiCreateCategoryHandlerApiCategoriesPostRequest,
  CategoriesApiGetCategoriesHandlerApiCategoriesGetRequest,
  CategoriesApiGetCategoryHandlerApiCategoriesCategoriesIdGetRequest,
  CategoriesApiUpdateCategoryHandlerApiCategoriesCategoriesIdPutRequest,
} from "@salut-mercado/octo-client";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const categories = {
  // Queries
  useGetAll: (
    args:
      | CategoriesApiGetCategoriesHandlerApiCategoriesGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["categories", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.categories.getCategoriesHandlerApiCategoriesGet(args).then((res) => res.data)
          : skipToken,
    }),
  useGetById: (
    args:
      | CategoriesApiGetCategoryHandlerApiCategoriesCategoriesIdGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["categories", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.categories.getCategoryHandlerApiCategoriesCategoriesIdGet(
                args
              ).then((res) => res.data)
          : skipToken,
    }),

  // Mutations
  useCreate: () =>
    useMutation({
      mutationKey: ["categories", "create"],
      mutationFn: (
        args: CategoriesApiCreateCategoryHandlerApiCategoriesPostRequest
      ) => api.categories.createCategoryHandlerApiCategoriesPost(args),
    }),
  useUpdate: () =>
    useMutation({
      mutationKey: ["categories", "update"],
      mutationFn: (
        args: CategoriesApiUpdateCategoryHandlerApiCategoriesCategoriesIdPutRequest
      ) =>
        api.categories.updateCategoryHandlerApiCategoriesCategoriesIdPut(args),
    }),
};
