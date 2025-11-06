import type { ResponseLoginApiAuthLoginPost } from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
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
      try {
        // Use Raw to inspect HTTP status for 202 next step
        const res = await api.auth.loginApiAuthLoginPost({
          loginRequest: { email: input.email, password: input.password },
        });

        // Check if response is an error
        if (!res.status && res.status >= 400) {
          const errorBody = res.request;
          const errorMessage =
            errorBody?.detail ||
            errorBody?.message ||
            `Request failed with status ${res.status}`;
          throw new Error(errorMessage);
        }

        const json = res.data;
        return { httpStatus: res.status, json } as const;
      } catch (error) {
        // Extract error message from API response body'
        if (isAxiosError(error)) {
          console.dir(error.response, { depth: null });
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Login failed";
          throw new Error(errorMessage);
        }
        // If it's already an Error with a message, re-throw it
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Login failed");
      }
    },
    onSuccess: ({ httpStatus, json }) => {
      if (json?.token) {
        finalizeLogin(json.token);
        return;
      }
      if (
        (httpStatus === 202 ||
          json?.next_step === "email_verification_required") &&
        json?.pending_authentication_token
      ) {
        setPendingToken(json.pending_authentication_token);
        setStep("otp");
        return;
      }
      // fallthrough: keep step
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async (input: VerifyOtpInput) => {
      if (!pendingToken) throw new Error("No pending token");
      try {
        const res = await api.auth.loginApiAuthLoginPost({
          loginRequest: {
            code: input.code,
            pending_authentication_token: pendingToken,
          },
        });

        // Check if response is an error
        if (!res.status && res.status >= 400) {
          const errorBody = res.data as { detail?: string; message?: string };
          const errorMessage =
            errorBody?.detail ||
            errorBody?.message ||
            `Request failed with status ${res.status}`;
          throw new Error(errorMessage);
        }

        const json = res.data;
        return { httpStatus: res.status, json } as const;
      } catch (error) {
        // Extract error message from API response body
        if (isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Verification failed";
          throw new Error(errorMessage);
        }
        // If it's already an Error with a message, re-throw it
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Verification failed");
      }
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
    [step, pendingToken, isAuthenticated, loginWithPassword, verifyOtp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
