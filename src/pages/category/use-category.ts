import {useQuery} from "@tanstack/react-query";
import {api} from "~/lib/api.ts";
import type {GetCategoriesHandlerApiCategoriesGetRequest} from "~/lib/.generated/client";

export const useCategories = (params: GetCategoriesHandlerApiCategoriesGetRequest) => {
    return useQuery({
        queryKey: ["category", JSON.stringify(params)],
        queryFn: () => api.categories.getCategoriesHandlerApiCategoriesGet(params)
    });
};