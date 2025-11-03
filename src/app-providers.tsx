import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AuthProvider } from "~/hooks/use-auth";
import { ThemeProvider } from "./components/common/theme-provider";
import { useInjectNavigate } from "./hooks/use-inject-navigate";
import "./lib/i18n";

const TEN_SECONDS = 1000 * 10;
const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: TEN_SECONDS,
      networkMode: "online",
      staleTime: CACHE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      retry(failureCount, error) {
        if (
          "response" in error &&
          typeof error.response === "object" &&
          error.response !== null &&
          "status" in error.response &&
          typeof error.response.status === "number" &&
          error.response.status === 404
        ) {
          return false;
        }
        if (error instanceof AxiosError && error.response?.status === 404) {
          return false;
        }
        if (error.message === "Not found") {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: { networkMode: "offlineFirst" },
  },
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useInjectNavigate();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
