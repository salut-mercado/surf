import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
    },
    mutations: { networkMode: "online" },
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
