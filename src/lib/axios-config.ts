import axios from "axios";
import { getTenantStore } from "../store/tenant.store";
import { api } from "./api";

export const apiAxios = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  const tenantId = getTenantStore().tenantId;
  if (tenantId) {
    config.headers = config.headers ?? {};
    config.headers["X-Tenant-Id"] = tenantId;
  }
  return config;
});

apiAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;
    const url: string = originalRequest?.url || "";
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/refresh");

    // Handle missing tenant header
    if (
      status === 400 &&
      !originalRequest?._tenantRetry &&
      error?.response?.data?.detail === "Missing X-Tenant-Id header"
    ) {
      originalRequest._tenantRetry = true;
      try {
        getTenantStore().markUnassigned(true);
      } catch {
        // ignore
      }
      return Promise.reject(error);
    }

    // Handle forbidden tenant
    if (
      status === 403 &&
      !originalRequest?._tenantRetry &&
      error?.response?.data?.detail === "Tenant not allowed"
    ) {
      originalRequest._tenantRetry = true;
      try {
        getTenantStore().markUnassigned(true);
      } catch {
        // ignore
      }
      return Promise.reject(error);
    }
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await api.auth.refreshTokenApiAuthRefreshPost();
        const newToken = refreshRes?.token;
        if (newToken) {
          localStorage.setItem("token", newToken);
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiAxios(originalRequest);
        }
      } catch {
        // ignore
      }
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);
