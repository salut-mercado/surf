import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const useSession = () => {
  const session = useQuery({
    queryKey: ["session"],
    queryFn: () => api.auth.meApiAuthMeGet(),
  });
  return session;
};
