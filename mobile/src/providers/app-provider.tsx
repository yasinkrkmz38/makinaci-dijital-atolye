import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { PropsWithChildren } from "react";
import { AuthProvider } from "./auth-provider";
import { NetworkProvider } from "./network-provider";
import { AppLockProvider } from "./app-lock-provider";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) =>
        count < 2 &&
        !(error instanceof Error && /yetkiniz|bulunamadı/i.test(error.message)),
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});
export function AppProvider({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <AppErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppLockProvider>
              <NetworkProvider>{children}</NetworkProvider>
            </AppLockProvider>
          </AuthProvider>
        </QueryClientProvider>
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}
