import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const auth = {
  useTenants: () =>
    useQuery({
      queryKey: ["tenants"],
      queryFn: () => api.auth.listMyTenantsApiAuthTenantsGet(),
    }),
  useMe: () =>
    useQuery({
      queryKey: ["me"],
      queryFn: () => api.auth.meApiAuthMeGet(),
    }),
};
