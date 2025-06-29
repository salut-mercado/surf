import {useQuery} from "@tanstack/react-query";
import {api} from "~/lib/api.ts";
import type {GetCategoriesHandlerApiCategoriesGetRequest} from "@salut-mercado/octo-client";

export const useCategories = (params: GetCategoriesHandlerApiCategoriesGetRequest) => {
    return useQuery({
        queryKey: ["categories", JSON.stringify(params)],
        queryFn: () => api.categories.getCategoriesHandlerApiCategoriesGet(params),
    });
};