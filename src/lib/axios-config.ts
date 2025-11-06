import axios from "axios";
import { getTenantStore } from "../store/tenant.store";
import { api } from "./api";

export const instance = axios.create({
  timeout: 30000,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  console.log("request", config);
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

instance.interceptors.response.use(
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
        const newToken = refreshRes.data?.token;
        if (newToken) {
          localStorage.setItem("token", newToken);
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch {
        // ignore
      }
      localStorage.removeItem("token");
      if (window.location.pathname !== "/auth/login") {
        if (window.navigate) {
          window.navigate("/auth/login?redirect=" + window.location.pathname);
        } else {
          window.location.href =
            "/auth/login?redirect=" + window.location.pathname;
        }
      }
    }
    return Promise.reject(error);
  }
);
