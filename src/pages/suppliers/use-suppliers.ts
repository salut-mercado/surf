import { useState, useCallback } from "react";
import type { SuppliersSchema, SupplierUpdateSchema } from "@salut-mercado/octo-client";
import { api } from "~/lib/api";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<SuppliersSchema[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.suppliers.getSuppliersApiSuppliersGet({
        skip: 0,
        limit: 100,
      });
      
      
      
      if (response.items) {
        setSuppliers(response.items);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('Failed to fetch suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSupplier = async (supplierData: Partial<SuppliersSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.suppliers.createSppliersApiSuppliersPost({
        suppliersSchema: {
          ...supplierData,
          analytics: true,
          blocked: false,
        } as SuppliersSchema,
      });
      await fetchSuppliers();
      return response.data;
    } catch (error) {
      setError('Failed to create supplier');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleAnalytics = async (supplierCode: string, checked: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await api.suppliers.updateSupplerApiSuppliersIdPut({
        id: supplierCode,
        supplierUpdateSchema: {
          analytics: checked,
        } as SupplierUpdateSchema,
      });
      await fetchSuppliers();
    } catch (error) {
      console.error('Error toggling analytics:', error);
      setError('Failed to update supplier analytics');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlocked = async (supplierCode: string, checked: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await api.suppliers.updateSupplerApiSuppliersIdPut({
        id: supplierCode,
        supplierUpdateSchema: {
          blocked: checked,
        } as SupplierUpdateSchema,
      });
      await fetchSuppliers();
    } catch (error) {
      console.error('Error toggling blocked status:', error);
      setError('Failed to update supplier blocked status');
    } finally {
      setLoading(false);
    }
  };

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    createSupplier,
    toggleAnalytics,
    toggleBlocked,
  };
} 