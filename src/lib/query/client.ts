import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/lib/auth/store";

// When any request comes back 401, the token is missing, expired, or not valid
// for the current backend. Clear the session so the auth gate returns the user
// to login, and say so once rather than failing silently.
let lastExpiredNotice = 0;
function handleAuthError(error: unknown): void {
  if (error instanceof ApiError && error.status === 401) {
    useAuthStore.getState().clear();
    const now = Date.now();
    if (now - lastExpiredNotice > 3000) {
      lastExpiredNotice = now;
      toast.error("Session expired", { description: "Please sign in again." });
    }
  }
}

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({ onError: handleAuthError }),
    mutationCache: new MutationCache({ onError: handleAuthError }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => {
          // Do not retry auth failures or client errors; retry transient ones.
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
}
