"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/store";
import { Spinner } from "@/components/ui/spinner";

export default function IndexPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useEffect(() => {
    router.replace(isAuthenticated() ? "/dashboard" : "/login");
  }, [router, isAuthenticated]);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  );
}
