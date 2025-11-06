import {
  AuthApi,
  CategoriesApi,
  Configuration,
  DiscountsApi,
  FirmsProducerApi,
  OrderInflowApi,
  OutflowsApi,
  SKUsApi,
  StockSKUApi,
  StoresApi,
  SuppliersApi,
  WarehouseApi,
} from "@salut-mercado/octo-client";
import { instance } from "./axios-config";

const basePath = import.meta.env.VITE_API_URL || "http://localhost:8000";

const config = new Configuration({
  basePath,
  accessToken: () => localStorage.getItem("token") || "",
});

export const api = {
  suppliers: new SuppliersApi(config, undefined, instance),
  producers: new FirmsProducerApi(config, undefined, instance),
  categories: new CategoriesApi(config, undefined, instance),
  sku: new SKUsApi(config, undefined, instance),
  auth: new AuthApi(config, undefined, instance),
  stores: new StoresApi(config, undefined, instance),
  outflows: new OutflowsApi(config, undefined, instance),
  discounts: new DiscountsApi(config, undefined, instance),
  warehouse: new WarehouseApi(config, undefined, instance),
  inflows: new OrderInflowApi(config, undefined, instance),
  stockSKU: new StockSKUApi(config, undefined, instance),
};
