"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/store";
import { Spinner } from "@/components/ui/spinner";

// Client-side gate: hydrates the persisted token, then either renders the app
// or redirects to /login. Kept simple deliberately; the backend is the real
// authority and rejects any request without a valid token.
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  React.useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router, isAuthenticated, token]);

  React.useEffect(() => {
    function recheck() {
      if (!isAuthenticated()) router.replace("/login");
    }
    window.addEventListener("visibilitychange", recheck);
    window.addEventListener("focus", recheck);
    return () => {
      window.removeEventListener("visibilitychange", recheck);
      window.removeEventListener("focus", recheck);
    };
  }, [router, isAuthenticated]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }
  return <>{children}</>;
}
