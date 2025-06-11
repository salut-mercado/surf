import type { CreateSppliersApiSuppliersPostRequest } from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const useCreateSupplier = () => {
    return useMutation({
        mutationFn: (data: CreateSppliersApiSuppliersPostRequest) =>
            api.suppliers.createSppliersApiSuppliersPost(data),
    });
};
