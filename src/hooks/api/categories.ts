import type {
  GetCategoriesHandlerApiCategoriesGetRequest,
  GetCategoryHandlerApiCategoriesCategoriesIdGetRequest,
  CreateCategoryHandlerApiCategoriesPostRequest,
  UpdateCategoryHandlerApiCategoriesCategoriesIdPutRequest,
} from "@salut-mercado/octo-client";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const categories = {
  // Queries
  useGetAll: (
    args: GetCategoriesHandlerApiCategoriesGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["categories", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.categories.getCategoriesHandlerApiCategoriesGet(args)
          : skipToken,
    }),
  useGetById: (
    args:
      | GetCategoryHandlerApiCategoriesCategoriesIdGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["categories", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.categories.getCategoryHandlerApiCategoriesCategoriesIdGet(
                args
              )
          : skipToken,
    }),

  // Mutations
  useCreate: () =>
    useMutation({
      mutationKey: ["categories", "create"],
      mutationFn: (args: CreateCategoryHandlerApiCategoriesPostRequest) =>
        api.categories.createCategoryHandlerApiCategoriesPost(args),
    }),
  useUpdate: () =>
    useMutation({
      mutationKey: ["categories", "update"],
      mutationFn: (
        args: UpdateCategoryHandlerApiCategoriesCategoriesIdPutRequest
      ) => api.categories.updateCategoryHandlerApiCategoriesCategoriesIdPut(args),
    }),
};


