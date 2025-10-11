import {
  AuthApi,
  CategoriesApi,
  Configuration,
  FirmsProducerApi,
  SKUsApi,
  SuppliersApi,
  SuppliersBankInfoApi,
  SuppliersDetailsApi,
  SuppliersGroupsApi,
} from "@salut-mercado/octo-client";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { apiAxios } from "./axios-config";

const basePath = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Axios-backed fetch adapter for OpenAPI client
const axiosFetch: typeof fetch = async (url, init) => {
  try {
    const resp: AxiosResponse = await apiAxios.request({
      url: String(url),
      method: init?.method || "GET",
      headers: Object.fromEntries(new Headers(init?.headers || {}).entries()),
      data: init?.body,
      withCredentials: true,
    });
    return axiosResponseToFetchResponse(resp);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const e = err as AxiosError;
      if (e.response) {
        return axiosResponseToFetchResponse(e.response);
      }
      // Network error: synthesize a 0 response
      return synthesizeResponse(0, "", {}, "");
    }
    throw err;
  }
};

function axiosResponseToFetchResponse(resp: AxiosResponse): Response {
  const status = resp.status;
  const statusText = resp.statusText || "";
  const headers = new Headers();
  const rawHeaders = resp.headers || ({} as Record<string, string>);
  Object.keys(rawHeaders).forEach((k) => headers.set(k, rawHeaders[k]));
  const data = resp.data;
  const bodyText = typeof data === "string" ? data : JSON.stringify(data ?? "");
  return synthesizeResponse(
    status,
    statusText,
    headers,
    bodyText,
    resp.config?.url || ""
  );
}

function synthesizeResponse(
  status: number,
  statusText: string,
  headers: HeadersInit | Headers,
  bodyText: string,
  url: string = ""
): Response {
  const responseLike = {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    url,
    headers: headers instanceof Headers ? headers : new Headers(headers),
    text: async () => bodyText,
    json: async () => {
      try {
        return bodyText ? JSON.parse(bodyText) : null;
      } catch {
        return bodyText;
      }
    },
    clone: () => synthesizeResponse(status, statusText, headers, bodyText, url),
  };
  return responseLike as Response;
}

const config = new Configuration({
  basePath,
  accessToken: () => localStorage.getItem("token") || "",
  fetchApi: axiosFetch,
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
