import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/common/theme-provider";
import { AuthProvider } from "~/hooks/use-auth";

const TEN_SECONDS = 1000 * 10;
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchInterval: TEN_SECONDS } },
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
