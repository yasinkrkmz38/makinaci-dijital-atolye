import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api, setAuthExpiredHandler } from "@/services/api";
import {
  clearTokens,
  hasStoredSession,
  saveTokens,
} from "@/services/token-store";
import type { AuthResponse, AuthTokens, User } from "@/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  sessionExpired: boolean;
  mfaTicket: string | null;
  login: (email: string, password: string) => Promise<"ok" | "mfa">;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyMfa: (code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
};
const AuthContext = createContext<AuthState | null>(null);
const isTokens = (value: AuthResponse): value is AuthResponse & AuthTokens =>
  !!(value.access_token && value.refresh_token);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true),
    [sessionExpired, setSessionExpired] = useState(false),
    [mfaTicket, setMfaTicket] = useState<string | null>(null);
  const reload = useCallback(async () => {
    const response = await api<{ user: User }>("/api/auth/me");
    setUser(response.user);
  }, []);
  useEffect(() => {
    setAuthExpiredHandler(() => {
      queryClient.clear();
      setUser(null);
      setSessionExpired(true);
    });
    return () => setAuthExpiredHandler(null);
  }, [queryClient]);
  useEffect(() => {
    (async () => {
      try {
        if (await hasStoredSession()) await reload();
      } catch {
        await clearTokens();
      } finally {
        setLoading(false);
      }
    })();
  }, [reload]);
  const accept = async (response: AuthResponse) => {
    if (!isTokens(response) || !response.user)
      throw new Error("Mobil oturum anahtarları alınamadı");
    await saveTokens(response);
    queryClient.clear();
    setUser(response.user);
    setSessionExpired(false);
    setMfaTicket(null);
  };
  const login = async (email: string, password: string) => {
    const response = await api<AuthResponse>("/api/auth/login", {
      auth: false,
      method: "POST",
      body: JSON.stringify({ email, password, client: "mobile" }),
    });
    if (response.mfa_required && response.mfa_ticket) {
      setMfaTicket(response.mfa_ticket);
      return "mfa";
    }
    await accept(response);
    return "ok";
  };
  const register = async (name: string, email: string, password: string) =>
    accept(
      await api<AuthResponse>("/api/auth/register", {
        auth: false,
        method: "POST",
        body: JSON.stringify({ name, email, password, client: "mobile" }),
      }),
    );
  const verifyMfa = async (code: string) => {
    if (!mfaTicket) throw new Error("MFA oturumu bulunamadı");
    await accept(
      await api<AuthResponse>("/api/auth/mfa/verify", {
        auth: false,
        method: "POST",
        body: JSON.stringify({ ticket: mfaTicket, code, client: "mobile" }),
      }),
    );
  };
  const forgotPassword = async (email: string) =>
    (
      await api<{ message: string }>("/api/auth/forgot-password", {
        auth: false,
        method: "POST",
        body: JSON.stringify({ email }),
      })
    ).message;
  const logout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      // Sunucuya ulaşılamasa da yerel anahtarlar mutlaka temizlenir.
    } finally {
      await clearTokens();
      queryClient.clear();
      setUser(null);
      setSessionExpired(false);
      setMfaTicket(null);
    }
  };
  const value = {user,loading,sessionExpired,mfaTicket,login,register,verifyMfa,forgotPassword,logout,reload};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider gerekli");
  return value;
}
