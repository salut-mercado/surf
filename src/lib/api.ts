import {
  SuppliersDetailsApi,
  SuppliersApi,
  SuppliersGroupsApi,
  SuppliersBankInfoApi,
  FirmsProducerApi,
  Configuration,
  CategoriesApi,
  SKUsApi,
  AuthApi,
} from "@salut-mercado/octo-client";
import { apiAxios } from "./axiosConfig";

const basePath = import.meta.env.VITE_API_URL || "http://localhost:8000";

const authFetch: typeof fetch = async (url, init) => {
  const headers = new Headers(init?.headers || {});
  const token = localStorage.getItem("token");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const doFetch = () =>
    fetch(url, { ...(init || {}), headers, credentials: "include" });
  let res = await doFetch();
  if (res.status !== 401) return res;
  try {
    const refresh = await apiAxios.post("/auth/refresh");
    const newToken = refresh?.data?.token;
    if (newToken) {
      localStorage.setItem("token", newToken);
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await doFetch();
      if (res.status !== 401) return res;
    }
  } catch {
    console.error("Error refreshing token");
  }
  localStorage.removeItem("token");
  window.location.href = "/auth/login";
  return res;
};

const config = new Configuration({
  basePath,
  accessToken: () => localStorage.getItem("token") || "",
  fetchApi: authFetch,
});

export const api = {
  suppliers: new SuppliersApi(config),
  suppliersDetails: new SuppliersDetailsApi(config),
  suppliersGroups: new SuppliersGroupsApi(config),
  suppliersBankInfo: new SuppliersBankInfoApi(config),
  producers: new FirmsProducerApi(config),
  categories: new CategoriesApi(config),
  sku: new SKUsApi(config),
  auth: new AuthApi(config),
};
