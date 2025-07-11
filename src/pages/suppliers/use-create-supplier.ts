import { api } from "~/lib/api";
import type { AddSupplierHandlerApiSuppliersPostRequest, /*SupplierUpdateSchema*/ } from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";

export function CreateSupplier() {
  return useMutation({ 
     mutationFn: (data : AddSupplierHandlerApiSuppliersPostRequest) =>
     api.suppliers.addSupplierHandlerApiSuppliersPost(data),
}); 
};