// import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { SupplierSchema, SupplierUpdateSchema } from "@salut-mercado/octo-client";
// import type { CreateSppliersApiSuppliersPostRequest } from "@salut-mercado/octo-client";

// export function useCreateSupplier() {
//   return useMutation({
//     mutationFn: async (data: CreateSppliersApiSuppliersPostRequest) => {
//       console.log('Sending data:', data);
//       return api.suppliers.createSppliersApiSuppliersPost(data);
//     },
//   });
// } 

export interface Suppliers {
  id: string,
  code: string,
  name: string,
  agent: string,
  phone: string,
  delayDays: number,
  taxID: string,
  blocked: boolean,
  analytics: boolean,
  comments: string
}

export interface UpdateSuppliers {
  code?: string,
  name?: string,
  agent?: string,
  phone?: string,
  delayDays?: number,
  taxID?: string,
  blocked?: boolean,
  analytics?: boolean,
  comments?: string
}

export function CreateSupplier(data: SupplierSchema) {
  return api.suppliers.addSupplierHandlerApiSuppliersPost({ supplierSchema: data })
    .catch(error => {
      console.log("Ошибка создания поставщика", error);
    });
}

export function PutSupplier(data: SupplierUpdateSchema, id: string) {
  return api.suppliers.updateSupplerHandlerApiSuppliersIdPut({ id, supplierUpdateSchema: data })
    .catch(error => {
      console.log("Ошибка обновления поставщика", error);
    });
}