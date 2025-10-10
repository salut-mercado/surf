import {
  SuppliersDetailsApi,
  SuppliersApi,
  SuppliersGroupsApi,
  SuppliersBankInfoApi,
  FirmsProducerApi,
  Configuration,
  CategoriesApi,
  SKUsApi,
} from "@salut-mercado/octo-client";

const config = new Configuration({
  basePath: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const api = {
  suppliers: new SuppliersApi(config),
  suppliersDetails: new SuppliersDetailsApi(config),
  suppliersGroups: new SuppliersGroupsApi(config),
  suppliersBankInfo: new SuppliersBankInfoApi(config),
  producers: new FirmsProducerApi(config),
  categories: new CategoriesApi(config),
  sku: new SKUsApi(config),
};
