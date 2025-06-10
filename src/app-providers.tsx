import { ThemeProvider } from "./components/common/theme-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            {children}
        </ThemeProvider>
    );
};
