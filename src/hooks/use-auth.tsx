import type { ResponseLoginApiAuthLoginPost } from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocation, useSearchParams } from "wouter";
import { api } from "~/lib/api";

export type AuthStep = "password" | "otp";

export interface LoginWithPasswordInput {
  email: string;
  password: string;
}

export interface VerifyOtpInput {
  code: string;
}

type AuthContextValue = {
  step: AuthStep;
  pendingToken: string | null;
  isAuthenticated: boolean;
  loginWithPassword: ReturnType<
    typeof useMutation<
      { httpStatus: number; json: ResponseLoginApiAuthLoginPost },
      Error,
      LoginWithPasswordInput
    >
  >;
  verifyOtp: ReturnType<
    typeof useMutation<
      { httpStatus: number; json: ResponseLoginApiAuthLoginPost },
      Error,
      VerifyOtpInput
    >
  >;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<AuthStep>("password");
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(typeof window !== "undefined" && localStorage.getItem("token"))
  );
  const [, setLocation] = useLocation();
  const [searchParams] = useSearchParams();

  const finalizeLogin = (token?: string) => {
    if (!token) return;
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setStep("password");
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setLocation(redirect);
    } else {
      setLocation("/suppliers");
    }
  };

  const loginWithPassword = useMutation({
    mutationFn: async (input: LoginWithPasswordInput) => {
      // Use Raw to inspect HTTP status for 202 next step
      const res = await api.auth.loginApiAuthLoginPostRaw({
        loginRequest: { email: input.email, password: input.password },
      });
      const json = await res.value();
      return { httpStatus: res.raw.status, json } as const;
    },
    onSuccess: ({ httpStatus, json }) => {
      if (json?.token) {
        finalizeLogin(json.token);
        return;
      }
      if (
        (httpStatus === 202 ||
          json?.nextStep === "email_verification_required") &&
        json?.pendingAuthenticationToken
      ) {
        setPendingToken(json.pendingAuthenticationToken);
        setStep("otp");
        return;
      }
      // fallthrough: keep step
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async (input: VerifyOtpInput) => {
      if (!pendingToken) throw new Error("No pending token");
      const res = await api.auth.loginApiAuthLoginPostRaw({
        loginRequest: {
          code: input.code,
          pendingAuthenticationToken: pendingToken,
        },
      });
      const json = await res.value();
      return { httpStatus: res.raw.status, json } as const;
    },
    onSuccess: ({ json }) => {
      if (json?.token) finalizeLogin(json.token);
    },
  });

  const logout = useCallback(async () => {
    try {
      await api.auth.logoutApiAuthLogoutPost();
    } catch {
      // ignore logout network errors
    } finally {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setLocation("/auth/login");
    }
  }, [setLocation]);

  const value = useMemo<AuthContextValue>(
    () => ({
      step,
      pendingToken,
      isAuthenticated,
      loginWithPassword,
      verifyOtp,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loginWithPassword and verifyOtp are not dependent on other values
    [step, pendingToken, isAuthenticated, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
