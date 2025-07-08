// import { useState, useCallback } from "react";
// import type { SuppliersSchema } from "@salut-mercado/octo-client";
import { api } from "~/lib/api";
// import type { SuppliersTableData } from "./suppliers-table";
import type { GetSupplierHandlerApiSuppliersGetRequest } from "@salut-mercado/octo-client";
import { useQuery } from "@tanstack/react-query";

// export function useSuppliers() {
//   const [suppliers, setSuppliers] = useState<SuppliersTableData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchSuppliers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.suppliers.getSupplierHandlerApiSuppliersGet({
//         skip: 0,
//         limit: 100,
//       });
      
//       if (response.items) {
//         setSuppliers(response.items);
//       } else {
//         setSuppliers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching suppliers:', error);
//       setError('Failed to fetch suppliers');
//       setSuppliers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const toggleAnalytics = async (supplierId: string, checked: boolean) => {
//     setLoading(true);
//     setError(null);
//     try {
//       setSuppliers(prev => prev.map(supplier => 
//         supplier.id === supplierId 
//           ? { ...supplier, analytics: checked }
//           : supplier
//       ));
//     } catch (error) {
//       console.error('Error toggling analytics:', error);
//       setError('Failed to update supplier analytics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleBlocked = async (supplierId: string, checked: boolean) => {
//     setLoading(true);
//     setError(null);
//     try {
//       setSuppliers(prev => prev.map(supplier => 
//         supplier.id === supplierId 
//           ? { ...supplier, blocked: checked }
//           : supplier
//       ));
//     } catch (error) {
//       console.error('Error toggling blocked status:', error);
//       setError('Failed to update supplier blocked status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     suppliers,
//     loading,
//     error,
//     fetchSuppliers,
//     toggleAnalytics,
//     toggleBlocked,
//   };
// } 
export const useSuppliers = (params : GetSupplierHandlerApiSuppliersGetRequest) => {
   return useQuery({
      queryKey: ["suppliers" , params],
      queryFn: () => api.suppliers.getSupplierHandlerApiSuppliersGet(params),
   });
};