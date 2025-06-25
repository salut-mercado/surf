// import { useMutation } from "@tanstack/react-query";
// import { api } from "~/lib/api";
// import type { CreateSppliersApiSuppliersPostRequest } from "@salut-mercado/octo-client";

// export function useCreateSupplier() {
//   return useMutation({
//     mutationFn: async (data: CreateSppliersApiSuppliersPostRequest) => {
//       console.log('Sending data:', data);
//       return api.suppliers.createSppliersApiSuppliersPost(data);
//     },
//   });
// } 

import { api } from '~/lib/axiosConfig'


export interface Suppliers {
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

export function CreateSupplier(data: Suppliers){
  return api.post('/suppliers/', data)
  .then(response => response.data)
  .catch(error => {
      console.log("Ошибка создания поставщика" , error.response.data)
  })
}